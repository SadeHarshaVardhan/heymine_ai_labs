import os

PROJECT_NAME = "heymine-ai-labs"

folders = [
    "",
    "config",
    "models",
    "routes",
    "controllers",
    "services",
    "utils",
    "public",
    "public/css",
    "public/js"
]

files = [
    ".env",
    ".env.example",
    "package.json",
    "server.js",

    "config/db.js",

    "models/Session.js",

    "routes/api.js",

    "controllers/chatController.js",
    "controllers/executionController.js",

    "services/groqService.js",
    "services/judge0Service.js",
    "services/promptService.js",

    "utils/testcaseValidator.js",

    "public/index.html",
    "public/compiler.html",

    "public/css/style.css",
    "public/css/compiler.css",

    "public/js/main.js",
    "public/js/compiler.js"
]

# Create folders
for folder in folders:
    path = os.path.join(PROJECT_NAME, folder)
    os.makedirs(path, exist_ok=True)

# Create files
for file in files:
    path = os.path.join(PROJECT_NAME, file)

    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            pass

print(f"\n✅ Project '{PROJECT_NAME}' created successfully!\n")

# Print tree
for root, dirs, files in os.walk(PROJECT_NAME):
    level = root.replace(PROJECT_NAME, "").count(os.sep)
    indent = "│   " * level
    print(f"{indent}📁 {os.path.basename(root)}")

    subindent = "│   " * (level + 1)
    for file in files:
        print(f"{subindent}📄 {file}")