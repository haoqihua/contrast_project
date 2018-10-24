###### Build and Run:
1. Please install Flask framework:`pip install Flask`
2. Go to "project" directory:`cd project`
3. In your terminal, run main.py:`python main.py`
4. Go to "http://0.0.0.0:8080/map" in your browser.

###### UI introduction: 
- First button: Load multiple IP address from Json file and display them on map   
- Second button: Search certain IP address from Json file

###### Basic Logic Flow:
1. User made requests in UI.
2.  Handled by functions in service layer.
3.  Service layer retrieve data from attacks.json
4.  Service layer also calls outside API to map IP to Geo-locations
5.  Service layer send back data to UI

###### Files:
```html
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
```
Technologies:
Python3, Flask Framework, JavaScript, Vue.JS

APIs:
Google Map, https://ipapi.co




