import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

IPO_XRAY_PROMPT = """You are IPO X-Ray, an elite forensic financial analyst specializing in Indian IPO Red Herring Prospectus (RHP) analysis.
Your sole purpose is to protect retail investors by identifying risks, red flags, and valuation concerns buried in RHP documents.
You MUST output your findings strictly as a structured JSON object matching the exact schema below. Do NOT output markdown or any other text. 

JSON SCHEMA TO RETURN:
{
  "company": "Company Name",
  "sector": "Sector (e.g. FINTECH, E-COMMERCE, MANUFACTURING)",
  "date": "IPO Date or Issue Date",
  "executiveSummary": "A highly critical 3-sentence plain English summary of the IPO, key concerns, and overall retail investor recommendation based strictly on the text provided.",
  "issueSize": "₹[XX] Cr",
  "promoterStake": "[XX]%",
  "verdict": "[PROCEED WITH CAUTION / HIGH RISK - AVOID / MODERATE RISK / LOW RISK]",
  "riskScore": 82, // A strict integer from 0 to 100 where 100 is catastrophic risk.
  "riskCategory": "HIGH", // Valid enum ONLY: "LOW", "MODERATE", "HIGH", "VERY HIGH"
  "redFlags": [
     {
       "severity": "Critical", // Valid enum ONLY: "Critical", "Moderate", "Watch"
       "title": "Short punchy name of the flag",
       "explanation": "2-sentence clear explanation of the forensic finding.",
       "pageCitation": "Page XX",
       "implication": "What this effectively means for a retail investor's money."
     }
  ],
  "financials": [ // Extract last 3 years of financial data if available. Map values to numbers.
     {
       "year": "FYxx", 
       "revenue": 1500, // Number in Cr
       "ebitdaMargin": -12.4, // Percentage Number
       "pat": -320, // Profit after tax in Cr (Number)
       "debtEquity": 1.2 // Number
     }
  ],
  "rpts": [ // Extract up to 5 of the most critical Related Party Transactions
     {
       "id": "1", // string id
       "party": "Party Name",
       "relationship": "Relationship Type",
       "type": "Transaction type (e.g. Loan, Service)",
       "amount": 450, // Value in Cr (Number)
       "percentRevenue": 13.0, // Percentage Number
       "risk": "HIGH" // Enum: "HIGH", "MEDIUM", "LOW"
     }
  ],
  "compliance": [ // Check SEBI ICDR regulations
     {
       "id": "1",
       "regulation": "Reg 24",
       "description": "Rule description checked",
       "status": "COMPLIANT", // Enum: "COMPLIANT", "AMBIGUOUS", "MISSING"
       "notes": "Any findings"
     }
  ],
  "peers": [ // Extract peer valuations and identify the target IPO itself
     {
       "name": "TARGET IPO", // Ensure this name matches the company above
       "pe": 85.2, // P/E ratio number
       "pb": 12.4, // P/B ratio number
       "evEbitda": 45.1, // EV/EBITDA number
       "isTarget": true // Boolean true for the analyzing company
     },
     {
       "name": "PEER 1", // Other listed peers found in the text
       "pe": 65.4,
       "pb": 8.2,
       "evEbitda": 32.5
     }
  ]
}

REMEMBER: Return ONLY the raw valid JSON payload. The system frontend will instantly parse this output string directly into its data state interface.
"""

async def generate_forensic_report(file_path: str) -> str:
    """Uploads the local document to Gemini and extracts the forensic JSON report asynchronously."""
    load_dotenv('.env', override=True)
    load_dotenv('.env.example', override=True)
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError("Invalid or missing GEMINI_API_KEY! Please ensure your key is placed inside the .env.example file.")

    genai.configure(api_key=api_key)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    try:
        pdf_file = genai.upload_file(path=file_path, display_name="RHP_Document")
    except Exception as e:
        raise RuntimeError(f"Failed to upload document to Gemini: {e}")
    
    while pdf_file.state.name == 'PROCESSING':
        time.sleep(5)
        pdf_file = genai.get_file(pdf_file.name)
        
    if pdf_file.state.name == 'FAILED':
        raise RuntimeError("Document processing failed on Google servers.")

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    try:
        response = model.generate_content(
            [pdf_file, IPO_XRAY_PROMPT],
            request_options={"timeout": 900},
            generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
        )
    except Exception as e:
        genai.delete_file(pdf_file.name)
        err_msg = str(e).lower()
        if "404" in err_msg or "not found" in err_msg:
            raise ValueError(f"Model Not Found: Your API tier may lack access to Gemini-2.5-Flash (Details: {e})")
        elif "429" in err_msg or "quota" in err_msg:
            raise PermissionError(f"Quota Exceeded: Your API key hit its usage limits (Details: {e})")
        else:
            raise RuntimeError(f"Gemini Server Error during chunk extraction: {e}")

    try:
        genai.delete_file(pdf_file.name)
    except Exception:
        pass

    return response.text
