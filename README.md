# RTaudit

## About
RTaudit is a simple web app demonstrating how a client could use the [Re-Assessment Timepoints](http://hl7.org/fhir/us/pacio-rt/2022Jan/) structure to audit an encounter. It was developed for and used in the HL7 May 2022 Connectathon for the [PACIO track](https://confluence.hl7.org/display/FHIR/2022-05+PACIO+Integration+of+Post-Acute+Care+IGs).

## Tech Stack
The initial app implementation is built by using React.js as the front-end web framework.

## Usage

### Running the RTaudit locally
To run the CareGapsCheck locally:
1. first clone the repository (github repo) and open it in Visual Studio code. 
2. next cd into the client folder and install project dependencies using `npm install`
3. run `npm start` which starts the main development environment for the front-end client

### Using the app

#### Connect to a server and an assessment

hree pieces of information are needed to start:
- Server: source information (example: [https://ohm.healthmanager.pub.aws.mitre.org/fhir/] ([MITRE open health manager](https://github.com/Open-Health-Manager/OpenHealthManager)) )
- assessment id: FHIR id of the target assessment (example: `P0522-v5-SNF-MOB-IP-MDS-IPA-1C`)

Once entered, click the `Submit` button. If successful, a table with details on the linked encounter will be loaded from the server

NOTE: for the Spring 2022 connectathon, we needed to use internal URLs for the data server and eCQM server to get this to work:
- [http://ohm.healthmanager.pub.aws.mitre.org:8080/fhir/]

#### Perform an audit

Click the `Timepoint Audit` button to load time points associated with the encounter. Each row has a `Load Supporting Info` button that can be clicked to load clinical data associated with the timepoint and its associated initiating clinical impression (basedOn extension).

Clicking on a `Load Supporting Info` will result in the display of a list of resource links that can be loaded and reviewed.