#!/bin/bash

# WorkFlow Hub - Automated Setup Script
# This script will guide you through the Supabase CLI setup

set -e

echo "🚀 WorkFlow Hub - Automated Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
echo "📦 Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Supabase CLI not found. Installing...${NC}"
    npm install -g supabase
    echo -e "${GREEN}✓ Supabase CLI installed${NC}"
else
    echo -e "${GREEN}✓ Supabase CLI already installed${NC}"
fi

echo ""

# Login to Supabase
echo "🔐 Login to Supabase..."
echo "Browser akan terbuka untuk authentication."
read -p "Press Enter to continue..."
supabase login

echo ""

# Link project
echo "🔗 Link to Supabase Project..."
echo ""
echo "Pilih salah satu:"
echo "1. Link ke project yang sudah ada"
echo "2. Buat project baru"
read -p "Pilihan (1/2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "Available projects:"
    supabase projects list
    echo ""
    read -p "Enter project ref: " project_ref
    supabase link --project-ref "$project_ref"
elif [ "$choice" == "2" ]; then
    echo ""
    echo "List organizations:"
    supabase orgs list
    echo ""
    read -p "Enter org ID: " org_id
    read -p "Enter project name (default: workflow-hub): " project_name
    project_name=${project_name:-workflow-hub}
    supabase projects create "$project_name" --org-id "$org_id"
    echo "Linking to new project..."
    supabase link
else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project linked${NC}"
echo ""

# Push database schema
echo "🗄️  Pushing database schema..."
echo "This will apply migrations to your Supabase project."
read -p "Continue? (y/n): " confirm

if [ "$confirm" == "y" ]; then
    supabase db push
    echo -e "${GREEN}✓ Database schema pushed${NC}"
else
    echo -e "${YELLOW}Skipped database push. Run 'supabase db push' manually later.${NC}"
fi

echo ""

# Generate .env.local
echo "🔑 Generating .env.local..."
supabase status --output env > .env.local
echo -e "${GREEN}✓ .env.local created${NC}"

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""

# Summary
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Start development server: ${GREEN}npm run dev${NC}"
echo "2. Open http://localhost:3000"
echo "3. Register first user (will be admin)"
echo "4. Deploy to Vercel: ${GREEN}vercel${NC}"
echo ""
echo "Useful commands:"
echo "  supabase status         - View project status"
echo "  supabase db push        - Push database changes"
echo "  supabase logs           - View logs"
echo ""
echo "Documentation: SETUP_CLI.md"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
