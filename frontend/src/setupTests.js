// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { Form } from 'react-bootstrap';


<Container>
    <Form onSubmit={handleSubmit}>
        {/* If error has a value, show the Alert */}
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant='danger'>{error}</Alert>}
        <Container>
            <Form.Select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
            >
                <option value="journal">Journal</option>
                <option value="reminder">Reminder</option>
            </Form.Select>
            <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {CATEGORY.map(item =>
                    <option
                        value={item.value}
                        label={item.label}
                        key={item.value}
                    />
                )}
            </Form.Select>
        </Container>

                       <Tabs
                    activeKey={entryType}
                    onSelect={(entryType) => setEntryType(entryType)}

                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="journal" title="Journal">
                        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {CATEGORY.map(item => 
                                <option 
                                    value={item.value} 
                                    label={item.label}
                                    key={item.value}
                                />
                            )}
                        </Form.Select>
                    </Tab>
                    <Tab eventKey="reminders" title="Reminder">
                        Tab content for Reminder
                    </Tab>
                </Tabs>
                
     
        <FloatingLabel controlId="floatingTextarea" label="Captain's Log">
            <Form.Control
                as="textarea"
                placeholder="Captain's Log"
                rows={25}
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
            />
        </FloatingLabel>
        <Button variant="light" type="submit" className='m-3'>Save</Button>
    </Form>
    <Container>
        <Question />
    </Container>
    <Container>
        <ShowLogs logs={logs}/>
    </Container>
</Container>