from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.action_chains import ActionChains
import time
import unittest

path = "http://localhost:1234"
class PythonTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
    
    def test_layers(self):
        print("************ Test layers ****************")
        driver = self.driver
        driver.get(path)

        element = driver.find_element_by_xpath("//ol[@id='allLayers']")
        #self.assertIn(null, element)

        #Open sidebar
        driver.find_element_by_id("btnOpenSidebar").click()

        #Go to NetworkTab
        driver.find_element_by_id("tabSidebarNetwork").click()

        #Check allLayers Ol for entries
        parentElement = driver.find_element_by_id("allLayers")
        elementList = parentElement.find_elements_by_tag_name("li")
        assert len(elementList) == 0
        print("len(elementList): " + str(len(elementList)))

        #Add layers
        driver.find_element_by_id("openAddLayerModal").click()
        driver.find_element_by_id("units").send_keys("2")
        driver.find_element_by_id("addLayer").click()

        #Check allLayers Ol for entries
        elementList = parentElement.find_elements_by_tag_name("li")
        assert len(elementList) == 1
        print("len(elementList): " + str(len(elementList)))

        time.sleep(1)

    def test_inputs(self):
        print("************ Test input ****************")
        driver = self.driver
        driver.get(path)

        #Open sidebar
        driver.find_element_by_id("btnOpenSidebar").click()

        #Go to NetworkTab
        driver.find_element_by_id("tabSidebarNetwork").click()

        element = driver.find_element_by_id("epochsChoice")
        element.clear()
        element.send_keys("10")
        print("Element value: " + element.get_attribute('value'))

        assert( element.get_attribute('value') == "10" )

        element = driver.find_element_by_id("learningRate")
        element.clear()
        element.send_keys("0.1")
        print("Element value: " + element.get_attribute('value'))

        assert( element.get_attribute('value') == "0.1" )

        element = driver.find_element_by_id("lossChoice")
        element.clear()
        element.send_keys("SeleniumTest")
        print("Element value: " + element.get_attribute('value'))

        assert( element.get_attribute('value') == "SeleniumTest" )

        element = Select(driver.find_element_by_id('optimizerChoice'))
        element.select_by_visible_text("adagrad")
        print("Element value: " + element.first_selected_option.text)
        assert(element.first_selected_option.text == "adagrad")
        
    
    def test_class(self):
        print("************ Test class ****************")
        sleeptime = 0
        driver = self.driver
        driver.get(path)
        driver.maximize_window()

        driver.find_element_by_id("btnOpenSidebar").click()
        #element = driver.find_element_by_id("downloadPolygons")

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)

        # from wherever the mouse is, I move to the top left corner of the broswer
        action = ActionChains(driver)
        action.move_by_offset(500, 700)
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(100))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(100), int(0))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(-50))
        action.click().perform()
        action.click().perform()
        time.sleep(2)

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown at close: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == True)

        # Adding name to class
        element = driver.find_element_by_id("newPolygonCategory")
        element.clear()
        element.send_keys("Skog")

        # Push button add
        driver.find_element_by_id("addClassName").click()
        
        # Push save polygon
        driver.find_element_by_id("savePolygon").click()
        
        # Search for new element
        #elements = driver.find_elements_by_xpath('//a[@href="Skogcollapse"]')
        elements = driver.find_elements_by_id("Skogcollapse")
        print("Number of elements at adding: " + str(len(elements)))
        assert(len(elements) == 1)

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)

        # Draw new polygon
        action.move_by_offset(50, 50)
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(100))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(100), int(0))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(-50))
        action.click().perform()
        action.click().perform()
        time.sleep(2)

        # Adding name to class
        element = driver.find_element_by_id("newPolygonCategory")
        element.clear()
        element.send_keys("Stad")

        # Push button add
        driver.find_element_by_id("addClassName").click()

        # Select dropdown
        select = Select(driver.find_element_by_id("classes"))

        # select by visible text
        select.select_by_visible_text('Skog')
        print("Select value Skog: " + select.first_selected_option.text)
        assert(select.first_selected_option.text == "Skog")

        # select by visible text
        select.select_by_visible_text('Stad')
        print("Select value Stad: " + select.first_selected_option.text)
        assert(select.first_selected_option.text == "Stad")

        # Push save polygon
        driver.find_element_by_id("savePolygon").click()

        # Search for new element
        #elements = driver.find_elements_by_xpath('//a[@href="Skogcollapse"]')
        elements = driver.find_elements_by_id("Stadcollapse")
        print("Number of elements at adding: " + str(len(elements)))
        assert(len(elements) == 1)

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)


    def test_clear_map(self):
        print("************ Test clear map ****************")
        sleeptime = 0
        driver = self.driver
        driver.get(path)
        driver.maximize_window()

        driver.find_element_by_id("btnOpenSidebar").click()
        #element = driver.find_element_by_id("downloadPolygons")

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)

        # from wherever the mouse is, I move to the top left corner of the broswer
        action = ActionChains(driver)
        action.move_by_offset(500, 700)
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(100))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(100), int(0))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(-50))
        action.click().perform()
        action.click().perform()
        time.sleep(2)

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown at close: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == True)

        # Push button close -> Dialog close and polygon is gone
        driver.find_element_by_id("closePolygonModal").click()

        # Search for new element
        elements = driver.find_elements_by_xpath('//div[@class="panel-heading"]')
        print("Number of elements at close: " + str(len(elements)))
        assert(len(elements) == 0)

        # Draw new polygon
        action.move_by_offset(0, 0)
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(100))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(100), int(0))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(-50))
        action.click().perform()
        action.click().perform()
        time.sleep(2)

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown at close: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == True)

        # Adding name to class
        element = driver.find_element_by_id("newPolygonCategory")
        element.clear()
        element.send_keys("Skog")

        # Push button add
        driver.find_element_by_id("addClassName").click()

        # Push save polygon
        driver.find_element_by_id("savePolygon").click()

        # Search for new element
        elements = driver.find_elements_by_id("Skogcollapse")
        print("Number of elements at adding: " + str(len(elements)))
        assert(len(elements) == 1)

        # Check if modal is shown
        modal = driver.find_element_by_id("setPolygonCategoryModal")
        print("Dialog is shown: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)
        time.sleep(2)

        # Click clear map
        driver.find_element_by_id("clearMapButton").click()

        # Search for new element
        elements = driver.find_elements_by_id("Skogcollapse")
        print("Number of class: " + str(len(elements)))
        assert(len(elements) == 1)

        elements = driver.find_elements_by_xpath('//button[@class="polygonRemoveButton btn btn-warning"]')
        print("Number of polygons: " + str(len(elements)))
        assert(len(elements) == 0)


    def test_download_polygons(self):
        print("************ Test download polygons ****************")
        driver = self.driver
        driver.get(path)
        driver.maximize_window()
        sleeptime = 0
        
        # Open sidebar
        driver.find_element_by_id("btnOpenSidebar").click()

        # from wherever the mouse is, I move to the top left corner of the browser
        action = ActionChains(driver)
        action.move_by_offset(500, 700)
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(100))
        action.click().perform()
        time.sleep(sleeptime)
        action = ActionChains(driver)
        action.move_by_offset(int(100), int(0))
        action.click().perform()
        action.click().perform()
        time.sleep(1)
        
        # Adding name to class
        element = driver.find_element_by_id("newPolygonCategory")
        element.clear()
        element.send_keys("Skog")

        # Push button add
        driver.find_element_by_id("addClassName").click()
        
        # Push save polygon
        driver.find_element_by_id("savePolygon").click()

        # Search for new element
        elements = driver.find_elements_by_id("Skogcollapse")
        print("Number of elements at adding: " + str(len(elements)))
        assert(len(elements) == 1)

        # Check if download modal is shown
        modal = driver.find_element_by_id("downloadPolygonsModal")
        print("Dialog download: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)
        time.sleep(1)

        # Push download button
        driver.find_element_by_id("downloadPolygons").click()

        # Check if download modal is shown
        modal = driver.find_element_by_id("downloadPolygonsModal")
        print("Dialog download: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == True)

        # Adding filename
        element = driver.find_element_by_id("geoJsonFileName")
        element.clear()
        element.send_keys("Test_download")
        time.sleep(1)

        # Click on close
        driver.find_element_by_id("btnClosePolygonDownload").click()
        time.sleep(1)

        # Check if download modal is shown
        modal = driver.find_element_by_id("downloadPolygonsModal")
        print("Dialog download: " + str(modal.is_displayed()))
        assert(modal.is_displayed() == False)
        time.sleep(1)

        # Push download button
        driver.find_element_by_id("downloadPolygons").click()
        time.sleep(1)

        # Check if input is the same
        element = driver.find_element_by_id("geoJsonFileName")
        print("Input text: " + element.get_attribute('value'))
        assert(element.get_attribute('value') == "Test_download")

        # Push save file
        driver.find_element_by_id("savePolygonsBtn").click()
        time.sleep(1)
        
        # TODO Check if savefile dialog is shown
        time.sleep(sleeptime)
        #assert(element.first_selected_option.text == "adagrad")

    
    def test_attributes(self):
        print("************ Test attributes ****************")
        sleeptime = 1
        driver = self.driver
        driver.get(path)
        driver.maximize_window()

        # Open sidebar
        driver.find_element_by_id("btnOpenSidebar").click()

        #Check length of attribute inputLists
        elements = driver.find_elements_by_xpath('//div[@class="col-12 attributeListDiv"]')

        print("Number of elements: " + str(len(elements)))
        assert(len(elements) == 0)

        # from wherever the mouse is, I move to the top left corner of the broswer
        action = ActionChains(driver)
        action.move_by_offset(500, 700)
        action.click().perform()
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(100))
        action.click().perform()
        action = ActionChains(driver)
        action.move_by_offset(int(100), int(0))
        action.click().perform()
        action = ActionChains(driver)
        action.move_by_offset(int(0), int(-50))
        action.click().perform()
        action.click().perform()
        time.sleep(2)  

        # Adding training area
        element = driver.find_element_by_id("checkTrainPolygon")
        element.click()
        print("Training checkbox is checked: " + str(element.is_selected()))
        assert(element.is_selected())

        # Push save polygon
        driver.find_element_by_id("savePolygon").click()
        time.sleep(sleeptime)

        #Go to NetworkTab
        driver.find_element_by_id("tabSidebarNetwork").click()

        #Open attributes
        driver.find_element_by_id("displayAttributesButton").click()
        time.sleep(sleeptime)

        #Check length of attribute inputLists
        elements = driver.find_elements_by_xpath('//div[@class="col-12 attributeListDiv"]')
        print("Number of elements: " + str(len(elements)))
        assert(len(elements) == 23)

        #Check all attributes
        #element = driver.find_element_by_id("checkboxAllAttributes")
        element = driver.find_element_by_class_name("attributesAllCheckbox")
        element.click()
        time.sleep(sleeptime)
        print("Attribute mastercheckbox is checked: " + str(element.is_selected()))
        assert(element.is_selected())

        driver.find_element_by_id("btnSaveAttributes").click()
        time.sleep(sleeptime)

        
    def test_networksettings_download(self):
        print("************ Test download networksettings ****************")
        driver = self.driver
        driver.get(path)

        #Open sidebar
        driver.find_element_by_id("btnOpenSidebar").click()

        #Go to NetworkTab
        driver.find_element_by_id("tabSidebarNetwork").click()

        #Add layers
        driver.find_element_by_id("openAddLayerModal").click()
        time.sleep(1)
        driver.find_element_by_id("units").send_keys("2")
        driver.find_element_by_id("addLayer").click()


        #Set epochs
        element = driver.find_element_by_id("epochsChoice")
        element.clear()
        element.send_keys("10")

        #Set Learning Rate
        element = driver.find_element_by_id("learningRate")
        element.clear()
        element.send_keys("0.1")

        #Set loss Choice
        #element = driver.find_element_by_id("lossChoice")
        #element.clear()
        #element.send_keys("SeleniumTest")

        #Set Optimizer
        element = Select(driver.find_element_by_id('optimizerChoice'))
        element.select_by_visible_text("adagrad")

        #Download settings

        driver.find_element_by_id("saveNetwork").click()
        time.sleep(1)
        driver.find_element_by_id("jsonFileName").send_keys("seleniumTest")
        driver.find_element_by_id("btnSaveNetworkModal").click()
        time.sleep(2)

    def tearDown(self):
        self.driver.quit()



if __name__ == "__main__":
    unittest.main()
