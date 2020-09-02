### Speech to text library:
Library used for this implementation is Web Speech API. You can find more information on this [https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#Browser_compatibility].

Few things to know about the Web Speech API:
  - It will work best on Chrome (Windows, MacOs and Android).
  - It requires internet connection.
  - Voice recognition does not happen locally. The data is sent to a server for recognition.
  
API has easy to use methods and events:

   (**Methods**):

  - Start.
  - Stop.
  - Abort.
  
  (**Events**):

  - onResult.
  - onStart.
  - onSpeechEnd.
  - onEnd.
  - onNoMatch.
  - onError.  
  
###Implementation of Speech to Text API:
A service was created to define initialization and control methods of the API. The service '**SpeechRecognitionService**' can be accessed at '**src/app/speech-recognition.service.ts**'.

The service is designed in a way that author has to just import the service wherever required in the code base and call methods based on the requirement to start and stop recording. 


The service contains methods like 


- **record()**: Initialize and start recording. This method is a listener. Once activated, it will be looking for evens supported by the API to react accordingly.
-  **DestroySpeechObject()**: This method will stop recording and send a complete event to the listener. We can decide what we want to do on receiving a complete event. 

To initialize the API for usage, the service sets few parameters:

- **SpeechRecognition.lang**: language of recognition (In our case en-us).
- **SpeechRecognition.interimResults**: defines whether the API should return interim or final results.
- **SpeechRecognition.maxAlternatives**: Number of potential alternative matches.

There are several ways the API can be triggered. Two ways are discussed and implemented as an example for your understanding. 

1. **Trigger with a button**: To see this example in action refer to the progress page in the dashboard component. It can be found at '**src/app/dashboard-progress**'. The HTML file '**dashboard-progress.component.html** will give you how to add a button and call a method to trigger the API on click of a button. The Typescript file '**dashboard-progress.component.ts**' will provide information on how to import the speech recognition service and how to add record and destroy functionality to button clicks.

2. **Use open and close of page/ use switch of a page**: To see this example in action refer to the Assessment page on the Home screen. It can be found at '**src/app/Assessment**'. For this example the trigger is not user based or not dependent on a user to do some kind on action on the page. The trigger is the loading of the page itself. So When user switches to Assessment page the Speech recognition starts and the speech recognition is stopped when the page is left or if user switches to another tab. The typescript file '**assessment.component.ts**' will provide information on how to use native angular methods like **OnInit()** and **OnDestroy()** methods to start recording on init and stop recording on destroy. 


Logging can be effectively used with the Speech recognition. For example the 2nd implementation done in the Assessment component has an ability to write data to the database. 
