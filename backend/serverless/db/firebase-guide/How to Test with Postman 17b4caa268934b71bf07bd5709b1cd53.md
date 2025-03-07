# How to Test with Postman

So you made a backend endpoint, and you're asked to test your code 🤦 but how??  We can do this with Postman!

## Setup

Go to [their website](https://www.postman.com/downloads/) and download the app or use it in browser (I use the app in this guide, but it should be almost exactly the same in browser).

Once opening the app, you may be prompted to create/select a workspace, and then create a new request.  Go ahead and create a new request. You'll then see this screen - this is where you can call your endpoint with special parameters/headers/body, and see its response!

![](How%20to%20Test%20with%20Postman%2017b4caa268934b71bf07bd5709b1cd53/Untitled.png)

**Before testing any endpoints, make sure you are running your backend locally or in the cloud.** 

If locally: go into the nms or functions directory and run `npm run dev`).  Your backend should be running on some local port specified in the terminal console.  This also means you are working with test data.

If cloud: make sure to use url that was provided to you from deploying. This will be https rather than http, since it is transport encrypted. 

## GET request walkthrough

Say I created a new endpoint `GET api/resources/:id`, and I want to test it.  I would make sure I selected a GET request, and typed my endpoint into the URL: `http://localhost:9000/api/resources/<id of resource>`.  Afterwards I'll hit send and I should see something like this on my screen (dependent on what your endpoint sends back):

![](How%20to%20Test%20with%20Postman%2017b4caa268934b71bf07bd5709b1cd53/Untitled%201.png)

## POST request walkthrough

Now let's say a created another endpoint, `POST api/admin/resources`.  I'll select POST in the upper left, and type this endpoint into the URL: `http://localhost:9000/api/admin/resources`.

Since this is a POST request though, I need to send some information in the body - for a resource, I'll be sending a name, description, category, and subcategory.  I can do this in the "Body" tab below my URL, formatted as JSON.

![](How%20to%20Test%20with%20Postman%2017b4caa268934b71bf07bd5709b1cd53/Untitled%202.png)

After adding relevant headers/params/authorization (explained below), I'm ready to send my request, and this is what I might see at the end (again, dependent on what your endpoint sends back):

![](How%20to%20Test%20with%20Postman%2017b4caa268934b71bf07bd5709b1cd53/Untitled%203.png)

### API KEYS

If you’re endpoint is protected, you’ll need an API token, which you can do here in the Auth tab by selecting type API Key and the key as X-API-Key and the value as the actual key value. 

(FYI: The X in X-API-KEY means that its a custom, user added header, rather than an automatic header that is generated from any request). Think of request headers as metadata. 

![Screenshot 2024-04-05 at 2.37.33 PM.png](How%20to%20Test%20with%20Postman%2017b4caa268934b71bf07bd5709b1cd53/Screenshot_2024-04-05_at_2.37.33_PM.png)

If you don't know what's right for your case, ask @Jakobi H