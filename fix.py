import os

def fix_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We want to replace getExpenses(DEFAULT_USER_ID, kwargs) -> getExpenses(kwargs)
    new_content = content.replace("DEFAULT_USER_ID, ", "")
    new_content = new_content.replace("DEFAULT_USER_ID", "")

    # Also remove the constant definition: const DEFAULT_USER_ID = 1;
    lines = new_content.split("\n")
    lines = [L for L in lines if "const DEFAULT_USER_ID =" not in L]
    new_content = "\n".join(lines)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Fixed", filepath)

for root, dirs, files in os.walk("frontend/src"):
    for file in files:
        if file.endswith(".js") or file.endswith(".jsx"):
            fix_file(os.path.join(root, file))
