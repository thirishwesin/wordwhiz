*******  How to create runnable jar file from springboot - maven application ******* 

firstly, define version name you want to release in pom.xml<version>xxx.jar<version>
for example, 
	<groupId>com.startinpoint.mediacorp.wordwhiz.chinese</groupId>
	<artifactId>WordWhizExternalDevTunnel</artifactId>
	<version>27.01.2022</version>
	<packaging>jar</packaging>


You can create runnable jar by two ways
1.Right click project then click 'Run As'
Maven Build
And you should type 'package' in input area then run. (or)
2.Right click project then click 'Run As'
Maven install

you will find /path/your/project/target/ there is your .jar file with dependencies.

You can run jar file by two ways.
1.right click your .jar file and 
 'Run As' > Run Configuration
 > choose Spring Boot App > Run
   (or)
2.right click target and show in 'Terminal'
 > run using 'java -jar xxxxx.jar'