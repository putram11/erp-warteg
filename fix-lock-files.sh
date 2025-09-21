#!/bin/bash

echo "🔧 Checking and fixing lock files for CI/CD..."

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Function to check and generate lock file
check_lock_file() {
    local dir=$1
    local name=$2
    
    echo "📦 Checking $name dependencies..."
    
    if [ -d "$dir" ]; then
        cd "$dir"
        
        # Check if package.json exists
        if [ ! -f "package.json" ]; then
            echo "❌ package.json not found in $dir"
            cd ..
            return 1
        fi
        
        # Check if package-lock.json exists
        if [ ! -f "package-lock.json" ]; then
            echo "⚠️  package-lock.json not found in $dir, generating..."
            
            # Remove node_modules if exists to ensure clean install
            if [ -d "node_modules" ]; then
                rm -rf node_modules
            fi
            
            # Generate lock file
            npm install
            
            if [ -f "package-lock.json" ]; then
                echo "✅ Generated package-lock.json for $name"
            else
                echo "❌ Failed to generate package-lock.json for $name"
                cd ..
                return 1
            fi
        else
            echo "✅ package-lock.json exists for $name"
            
            # Verify and update if needed
            echo "🔄 Verifying dependencies for $name..."
            npm ci --silent
        fi
        
        cd ..
    else
        echo "❌ Directory $dir not found"
        return 1
    fi
}

# Check backend
check_lock_file "backend" "Backend"

# Check frontend  
check_lock_file "frontend" "Frontend"

echo ""
echo "🎉 Lock files check completed!"
echo ""
echo "📋 Summary:"
echo "- Backend package-lock.json: $([ -f backend/package-lock.json ] && echo '✅ OK' || echo '❌ Missing')"
echo "- Frontend package-lock.json: $([ -f frontend/package-lock.json ] && echo '✅ OK' || echo '❌ Missing')"
echo ""
echo "💡 You can now commit and push the lock files:"
echo "   git add backend/package-lock.json frontend/package-lock.json"
echo "   git commit -m 'Add package-lock.json files for CI/CD'"
echo "   git push"
