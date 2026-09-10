with open("frontend/src/components/ProfileViewer.jsx", "r") as f:
    content = f.read()

content = content.replace("MY PROFILE", "My Profile")
content = content.replace('<div className="p-4 space-y-4">', '<div className="p-4 space-y-4">\n            <p className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Your financial snapshot</p>')

with open("frontend/src/components/ProfileViewer.jsx", "w") as f:
    f.write(content)
