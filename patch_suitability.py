with open("frontend/src/components/SuitabilityCard.jsx", "r") as f:
    content = f.read()

replacement = """
      {/* Structured Pros & Constraints Chips */}
      <div className="pt-3 pb-3 space-y-1.5 border-t border-gray-200/60 my-2">
        <h4 className="text-sm font-bold text-gray-900 mb-2">Why this may fit you</h4>
        {result.pros.map((pro, i) => (
"""

content = content.replace("      {/* Structured Pros & Constraints Chips */}\n      <div className=\"pt-2 pb-3 space-y-1.5 border-t border-gray-200/60 my-2\">\n        {result.pros.map((pro, i) => (", replacement)

with open("frontend/src/components/SuitabilityCard.jsx", "w") as f:
    f.write(content)
