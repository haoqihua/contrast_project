Build and Run:
Please install Flask framework: "pip install Flask"
Go to "project" directory: "cd project"
In your terminal, run main.py: "python main.py"
Go to "http://0.0.0.0:8080/map" in your browser.



UI introduction:
    First button: Load multiple IP address from Json file and display them on map
    Second button: Search certain IP address from Json file
    


Basic Logic Flow:
    1. User made requests in UI.
    2. Handled by functions in service layer.
    4. Service layer retrieve data from attacks.json
    5. Service layer also calls outside API to map IP to Geo-locations
    6. Service layer send back data to UI


Files:
    Service Layer:
        main.py:
            First component of service layer, handles all requests from UI.
        data.py:
            Handles all data operations.
    UI:
        templates/map.html
            Contains the map.
        static/map.js
            Initialize Google Map
        static/controller.js
            Main component, receives data from service layer
            Interact with Google Map API
            Handles Grid Control
            Form validations
        

Technologies:
Python3, Flask Framework, JavaScript, Vue.JS

APIs:
Google Map, https://ipapi.co




