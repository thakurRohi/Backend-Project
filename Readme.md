connecting databse :-
points to remmebr :-
while connecting to DB ther is alwyas chances that errors will occur , So its important to wrap the code in try catch to find errors.
--> database is present in different continent so it takes time to connect or communicate with database .

when any cahnges are made in env variable you have to manualy restrat the nodemon server 


2. Middleware :- 

 .. if we see the process of connecting with datbase then we have to implement the try and catch also async await
 Thus this kind of wrappers will always be used while communicating with databse . so instead of writting it again and again we will simply make a wrapper in utils folder and whenever we require the wrapper just simply call it from utils folder. 
 custom API


3. User and video models:-

4.  File upload:-
Production grade projects use 3rd part services instead of server of their own to upload or store files . Also code of file upload is kept in utils folder as a result it could be reused again and again . 

Common services we will be using :- Cloudinary 
We are going to get the local path of file uploadaed in server , via this path file is uploaded at cloudinary server . Consecutively removew file from server . 