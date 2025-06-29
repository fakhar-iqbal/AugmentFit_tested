#!/usr/bin/env python3
"""
Test runner script for Selenium tests
"""
import subprocess
import sys
import os

def run_tests():
    """Run the test suite with HTML report generation"""
    
    # Ensure we're in the right directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Command to run pytest with HTML report
    cmd = [
        sys.executable, "-m", "pytest", 
        "-v",  # verbose output
        "--html=reports/test_report.html",  # HTML report
        "--self-contained-html",  # Include CSS/JS in HTML
        "test_web_app.py"
    ]
    
    # Create reports directory if it doesn't exist
    os.makedirs("reports", exist_ok=True)
    
    try:
        result = subprocess.run(cmd)
        
        print("STDOUT:")
        print(result.stdout)
        
        if result.stderr:
            print("STDERR:")
            print(result.stderr)
        
        print(f"Return code: {result.returncode}")
        
        # Return the exit code
        return result.returncode
        
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)