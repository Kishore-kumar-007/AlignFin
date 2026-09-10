import re

with open("frontend/src/components/DocumentScanner.jsx", "r") as f:
    content = f.read()

content = content.replace("Document Auditor & Scanner", "Analyze a document")
content = content.replace("Extract hidden fees, lock-in periods, and penalties directly from your PDFs or text documents.", "Upload a financial document such as a policy, agreement or product brochure.")
content = content.replace("✓ Uploaded & Scanned", "✓ Document analyzed")
content = content.replace("Important Terms", "What we found")

# Convert some headers
content = content.replace(">Fees & Penalties<", ">Fees & charges<")
content = content.replace(">Potential Concerns<", ">Potential concerns<")
content = content.replace("AlignFin Intelligence Assessment:", "Analysis Summary")
content = content.replace("Browse Files", "Upload Document")

with open("frontend/src/components/DocumentScanner.jsx", "w") as f:
    f.write(content)
