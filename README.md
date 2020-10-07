#Image Upload Service
This Image Upload Service uploads a given image of type jpeg/png with a description to AWS S3 and stores the image metadata to AWS MySQL RDS. The service is extendable to support Db migration as well. It handles all the edge cases and failures and displays user friendly message to the end user.
The service also handles logical inconsistency where it first tries to upload the image to S3, if it is successfully uploaded then it tries to insert the data into RDS. If RDS operation fails, then the uploaded image is deleted from S3 and user is notified that the upload was unsuccessful.  
The backend is written in Javascript.  

##System Dependencies
Ensure following dependencies are present before installing the application.
1. ```AWS S3```  bucket for storing the images. Ensure that ```access key``` provided to the application has the permission to do ```PutObject``` and ```DeleteObject``` commands on the bucket.
2. ```AWS Mysql RDS``` version 5.x or later. Ensure that username and password combination provided to the application has access to connect to the RDS and do create, drop & insert query on it.

##Installation of service

###Local environment
1. Make sure ```node 8.x or higher``` and ```npm 6.x``` is installed.
2. Find ```deployConfig.js``` file inside ```config``` folder and put the bucket name and RDS host in ```dev``` config. Rest details need not be changed.
    ```
   awsBucketName:
   mysqlDbConfig: {
        host: 
        port: 
   }
   ```
3. Find ```aws-credentials``` file in the project directory and put the following fields in under ```image-upload-service-dev``` tag. The fields are self-explanatory.
    ```
   aws_access_key_id = 
   aws_secret_access_key =
   rds_image_db_user = 
   rds_image_db_password = 
   ```
4. Checkout the Project directory in terminal and run ```npm install ```.
5. Run ```npm start``` after the npm packages are installed successfully.
6. The server will start and create the required database and table on its own in the provided ```AWS RDS```.
7. Open ```127.0.0.1``` in browser (The Latest Chrome version), and the application will be ready to use.
8. Application logs can be found inside ```logs``` folder.

###Production environment
1. Make sure ```node 8.x or higher``` and ```npm 6.x``` is installed.
2. Find ```deployConfig.js``` file inside ```config``` folder and put the bucket name and RDS host in ```prod``` config. Rest details need not be changed.
    ```
   awsBucketName:
   mysqlDbConfig: {
        host: 
        port: 
   }
   ```
3. Find ```aws-credentials``` file in the project directory and put the following fields in under ```image-upload-service-prod``` tag. The fields are self-explanatory.
    ```
   aws_access_key_id = 
   aws_secret_access_key =
   rds_image_db_user = 
   rds_image_db_password = 
   ```
4. Checkout the Project directory in terminal and run ```npm install ```.
5. Export env variable using command ```export NODE_ENV=prod```.
6. Run ```npm start``` after the npm packages are installed successfully.
7. The server will start and create the required database and table on its own in the provided ```AWS RDS```.
8. Application logs can be found inside ```logs``` folder.
