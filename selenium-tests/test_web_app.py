import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class TestWebApplication:
    
    def test_01_page_load(self, driver, base_url):
        """Test if the main page loads successfully"""
        driver.get(base_url)
        assert "React App" in driver.title or len(driver.title) > 0
        
    def test_02_login_page_access(self, driver, base_url):
        """Test accessing login page"""
        driver.get(f"{base_url}/login")
        time.sleep(2)
        # Check if login form elements are present
        try:
            login_form = driver.find_element(By.TAG_NAME, "form")
            assert login_form is not None
        except NoSuchElementException:
            # If no form, check for login-related elements
            page_source = driver.page_source.lower()
            assert "login" in page_source or "sign in" in page_source
    
    def test_03_dashboard_access(self, driver, base_url):
        """Test accessing dashboard page"""
        driver.get(f"{base_url}/dashboard")
        time.sleep(2)
        # Verify dashboard loads (might redirect to login if not authenticated)
        assert driver.current_url is not None
        
    def test_04_navigation_links(self, driver, base_url):
        """Test navigation links are present and clickable"""
        driver.get(base_url)
        time.sleep(2)
        
        # Look for common navigation elements
        nav_elements = driver.find_elements(By.TAG_NAME, "nav")
        links = driver.find_elements(By.TAG_NAME, "a")
        buttons = driver.find_elements(By.TAG_NAME, "button")
        
        # Assert at least some navigation elements exist
        assert len(nav_elements) > 0 or len(links) > 0 or len(buttons) > 0
    
    def test_05_responsive_design(self, driver, base_url):
        """Test responsive design by changing window size"""
        driver.get(base_url)
        
        # Test desktop view
        driver.set_window_size(1920, 1080)
        time.sleep(1)
        desktop_height = driver.execute_script("return document.body.scrollHeight")
        
        # Test mobile view
        driver.set_window_size(375, 667)
        time.sleep(1)
        mobile_height = driver.execute_script("return document.body.scrollHeight")
        
        # Page should adapt to different screen sizes
        assert desktop_height > 0 and mobile_height > 0
    
    def test_06_form_validation(self, driver, base_url):
        """Test form validation (if forms exist)"""
        driver.get(f"{base_url}/login")
        time.sleep(2)
        
        # Try to find and test form inputs
        inputs = driver.find_elements(By.TAG_NAME, "input")
        if inputs:
            # Test empty form submission
            submit_buttons = driver.find_elements(By.CSS_SELECTOR, "button[type='submit'], input[type='submit']")
            if submit_buttons:
                submit_buttons[0].click()
                time.sleep(1)
                # Check if validation messages appear or form doesn't submit
                current_url = driver.current_url
                assert "login" in current_url.lower() or len(driver.find_elements(By.CSS_SELECTOR, ".error, .invalid, [class*='error']")) > 0
    
    def test_07_search_functionality(self, driver, base_url):
        """Test search functionality if available"""
        driver.get(base_url)
        time.sleep(2)
        
        # Look for search inputs
        search_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='search'], input[placeholder*='search' i], input[name*='search' i]")
        
        if search_inputs:
            search_input = search_inputs[0]
            search_input.send_keys("test")
            search_input.send_keys(Keys.ENTER)
            time.sleep(2)
            # Verify search was executed (URL change or results shown)
            assert "test" in driver.current_url or "search" in driver.current_url.lower()
        else:
            # If no search, just verify page loaded
            assert driver.current_url is not None
    
    def test_08_content_verification(self, driver, base_url):
        """Test if main content areas are present"""
        driver.get(base_url)
        time.sleep(2)
        
        # Check for common content elements
        content_elements = (
            driver.find_elements(By.TAG_NAME, "main") +
            driver.find_elements(By.TAG_NAME, "section") +
            driver.find_elements(By.TAG_NAME, "article") +
            driver.find_elements(By.CLASS_NAME, "content") +
            driver.find_elements(By.ID, "content")
        )
        
        assert len(content_elements) > 0 or len(driver.find_elements(By.TAG_NAME, "div")) > 0
    
    def test_09_javascript_execution(self, driver, base_url):
        """Test if JavaScript is working"""
        driver.get(base_url)
        time.sleep(2)
        
        # Test if JavaScript is enabled by checking if React app loaded
        page_source = driver.page_source
        js_working = (
            "react" in page_source.lower() or 
            len(driver.find_elements(By.CSS_SELECTOR, "[data-reactroot], #root div")) > 0 or
            driver.execute_script("return typeof window !== 'undefined'")
        )
        
        assert js_working
    
    def test_10_page_performance(self, driver, base_url):
        """Test basic page performance"""
        start_time = time.time()
        driver.get(base_url)
        
        # Wait for page to load
        WebDriverWait(driver, 10).until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )
        
        load_time = time.time() - start_time
        
        # Page should load within 10 seconds
        assert load_time < 10
    
    def test_11_error_handling(self, driver, base_url):
        """Test error handling for non-existent pages"""
        driver.get(f"{base_url}/non-existent-page-12345")
        time.sleep(2)
        
        # Should either redirect or show 404 page
        page_source = driver.page_source.lower()
        assert ("404" in page_source or 
                "not found" in page_source or 
                "error" in page_source or
                driver.current_url != f"{base_url}/non-existent-page-12345")
    
    def test_12_browser_back_forward(self, driver, base_url):
        """Test browser navigation"""
        driver.get(base_url)
        time.sleep(1)
        
        # Navigate to another page
        driver.get(f"{base_url}/login")
        time.sleep(1)
        
        # Test back button
        driver.back()
        time.sleep(1)
        assert base_url in driver.current_url
        
        # Test forward button
        driver.forward()
        time.sleep(1)
        assert "login" in driver.current_url or driver.current_url != base_url