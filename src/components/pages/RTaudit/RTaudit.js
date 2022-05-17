import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import axios from "axios";
import "./RTaudit.css"; // Import styling
import FHIR from "fhirclient"

<script src="./node_module/fhirclient/build/fhir-client.js"></script>

function RTaudit() {
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const [assessmentData, setAssessmentData] = useState([]);
    const [timepointsData, setTimepointsData] = useState([]);
    const [supportingClinicalImpression, setSupportingClinicalImpression] = useState([]);
    const [patientID, setPatientID] = useState('');
    const [fhirServer, setFhirServer] = useState('');
    const [assessmentId, setAssessmentId] = useState('');

    const onSubmit = async (data) => {
        console.log(data)
        const assessmentId = data.assessmentId
        setAssessmentId(assessmentId)
        const server = data.server
        setFhirServer(server)
        const client = FHIR.client(server);
        
        client.request("Observation/" + assessmentId)
        .then(setAssessmentData)
        .catch(display); 
    }

    const doAudit = async () => {
        console.log("auditing")
        await getTimepoints()
        //await getSupportingInfo()
    }


    const getTimepoints = async () => {
        
        const client = FHIR.client(fhirServer);
        
        client.request(assessmentData.encounter.reference)
            .then( encounterData => {
                console.log(encounterData)
                if (encounterData?.id) {
                    client.request("Encounter?part-of=" + assessmentData.encounter.reference + "&_profile=http://hl7.org/fhir/us/pacio-rt/StructureDefinition/reassessment-timepoints-encounter")
                        .then( timepoints => {
                            setTimepointsData(timepoints)
                        })
                        .catch(console.log)  
                }
            })
            .catch(console.log) 
    }

    const getSupportingInfo = async (ciReference) => {
        
        const client = FHIR.client(fhirServer);
        client.request(ciReference)
            .then( clinicalImpression => {
                console.log(clinicalImpression)
                setSupportingClinicalImpression(clinicalImpression)
            })
            .catch(console.log)
    }
            

    function display(data) {
        const output = document.getElementById("output");
        output.innerText = data instanceof Error ?
            String(data) :
            JSON.stringify(data, null, 4);
    }

    return (
        <Container fluid className="content-block">
            <Row style={{ paddingTop: "20px" }}>
                <Col md={6}>
                    <h1>Assessment Audit</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3>Server: </h3><input type="text" className="form-control" {...register("server", { required: true })} />
                        {errors.server && <p className="error-text">fhir server is required</p>}
                        <h3>Assessment Id: </h3><input type="text" className="form-control" {...register("assessmentId", { required: true })} />
                        {errors.assessmentId && <p className="error-text">assessmentId required</p>}
                        <Button variant='form' type="submit">Submit</Button>
                    </form>
                </Col>
            </Row>
            <div id="output"/>
            {assessmentData?.id &&
                <Row>
                    <Col md={6}>
                        <h2 style={{ paddingTop: "30px" }}>Assessment Details</h2>

                        <Table striped bordered hover variant="dark" responsive="lg">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Encounter</th>
                                    <th>Date</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>

                                    <tr className="tableList" key="0">
                                        <td>{assessmentData.subject.reference}</td>
                                        <td>{assessmentData.encounter.reference}</td>
                                        <td>{new Date(assessmentData.effectiveDateTime).toLocaleString()}</td>
                                        
                                        <td><a href={fhirServer + "Observation/" + assessmentData.id}>{fhirServer + "Observation/" + assessmentData.id}</a></td>
                                    </tr>
                            </tbody>
                        </Table>
                        <Button variant='form' onClick={() => doAudit()}>Timepoint Audit</Button>

                    </Col>
                </Row>
            }
            {timepointsData?.entry &&
                <Row>
                    <Col md={6}>
                        <h2 style={{ paddingTop: "30px" }}>Timepoint Details</h2>

                        <Table striped bordered hover variant="dark" responsive="lg">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Clinical Impression with Supporting Info</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timepointsData.entry.map((entry, index) => (
                                    <tr className="tableList" key={index}>
                                        <td>{entry.resource.id}</td>
                                        <td>{new Date(entry.resource.period.start).toLocaleString()}</td>
                                        <td>{new Date(entry.resource.period.end).toLocaleString()}</td>
                                        <td>
                                            <a href={fhirServer + entry.resource.basedOn[0].extension[0].valueReference.reference}>{fhirServer + entry.resource.basedOn[0].extension[0].valueReference.reference}</a>
                                            <hr/>
                                            <Button variant='form' onClick={() => getSupportingInfo(entry.resource.basedOn[0].extension[0].valueReference.reference)}>Load Supporting Info</Button>
                                        </td>
                                        <td><a href={fhirServer + "Encounter/" + entry.resource.id}>{fhirServer + "Encounter/" + entry.resource.id}</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            }
            {supportingClinicalImpression?.id &&
                <Row>
                    <Col md={6}>
                        <h2 style={{ paddingTop: "30px" }}>{"Supporting Info for " + supportingClinicalImpression.id}</h2>

                        <Table striped bordered hover variant="dark" responsive="lg">
                            <thead>
                                <tr>
                                    <th>Supporting Info Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supportingClinicalImpression.supportingInfo.map((entry, index) => (
                                    <tr className="tableList" key={index}>
                                        <td><a href={fhirServer + entry.reference}>{fhirServer + entry.reference}</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            }
            
            
        </Container>
    )
}

export default RTaudit;

