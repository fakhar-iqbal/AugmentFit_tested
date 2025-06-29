import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture(scope="function")
def driver():
    """Setup Chrome driver with headless mode for Jenkins"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--remote-debugging-port=9222")
    
    # Get the ChromeDriver path and ensure it's the actual binary
    chromedriver_path = ChromeDriverManager().install()
    
    # Fix common path issue where it points to wrong file
    if chromedriver_path.endswith('THIRD_PARTY_NOTICES.chromedriver'):
        # Navigate to the actual chromedriver binary
        chromedriver_dir = os.path.dirname(chromedriver_path)
        actual_chromedriver = os.path.join(chromedriver_dir, 'chromedriver')
        if os.path.exists(actual_chromedriver):
            chromedriver_path = actual_chromedriver
        else:
            # Try without extension
            actual_chromedriver = os.path.join(chromedriver_dir, 'chromedriver-linux64', 'chromedriver')
            if os.path.exists(actual_chromedriver):
                chromedriver_path = actual_chromedriver
    
    # Make sure the file is executabl
    if os.path.exists(chromedriver_path):
        os.chmod(chromedriver_path, 0o755)
    
    service = Service(chromedriver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()

@pytest.fixture(scope="session")
def base_url():
    """Base URL of your web application"""
    # Use environment variable or default to EC2 deployment URL
    return os.getenv('BASE_URL', 'http://localhost:8081')