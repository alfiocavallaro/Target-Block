# Target-Block

This project proposes a goal-oriented platform able to perform a set of task necessary to achieve the request expressed by user.

The proposed scenario is constituted by an intelligent environment in which they are immersed several smart objects.

This platform is a middleware between user and smart object. Users express their request in form of goal. The platform understand the request and coordinates the action of smart object.

The platform is made of serveral parts: Undertanding Block, Task Coordinator, Discovery Block, Target Block, SmartHome-Application-Client.

This module is a Bridge between TaskCoordinator and real object. It's translat the request received from task coordinator into a format understandable to the specified Smart Object using a communication protocol specified in a config file.

It requires Node.js and Mongo DB installed. 
Install the system with command "npm install".
Run the system with command "node server".


  
