# Design
In the design I will refer to the Electron App as the Agent App and the Android/iOS app as the Mobile App.

The application will be responsible for handling requests from several users.
The user scan the QR Code which is shown on the Agent application and send the identification info.
The user can be identified by the device ID or per user - using facebook authorization.

After the user scan the QR Code, a call from the Mobile App is sent to the Agent app in order to identify the user and loads
the user relevant metadata.

The metadata of the user includes:
 * the statistics of the transfers.
 * the history of the user.
 * the related text databases

## Database
The database is saved as a json files. The plan is to chunk the database to limited file size. However, due to limited 
resource, this feature will come in later versions.

### Model

![Design](./design.png "Database model")

#### Scan & Authentication

See README of app



Refer to the readme of the Mobile App



