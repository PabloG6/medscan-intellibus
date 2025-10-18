# Introduction
Doctor's have difficulty analyzing ct scans to find illnesses. We are building a centralized chat application that uses multiple models to make more accurate guesses on the type of illness a person has.

## Deliverables
- Authentication
- Realtime Stream chat
- Chatbox with ability to search models...
- chat interface that is designed around a specific patient...

Based on this image, does this person have breast cancer...


```typescript 


const models = [
    {
        name: "google/fracture",
        description: "This model is for hairline fractures"
    },
    {
        name: "microsoft/ultrasound",
        description: "This model is for ultrasounds"
    }
]

//initial call to figure out intent
    const question = "Does this user have a fracture";
    const result = await generateText({
                            model: googleProvider('google-gemini-1.5-latest'),
                            schema: zodSchema, // Single object schema, not array
                            messages: [{
                                role: 'user',
                                content: [
                                    question,
                                    ...models
                                    "based on the prompt, what is this user asking us to do. return the best model for the job"
                                ],
                            }],

                            maxTokens: 4096,
                        });

    // for argument sake, result returns google fracture"


    const model = models.filter(model => model.name == result)
    callModel(model);
```