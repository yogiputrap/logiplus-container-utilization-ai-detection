import { NextRequest, NextResponse } from 'next/server';

interface RoboflowPrediction {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
    class_id: number;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to base64 for Roboflow API
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');

        try {
            // Call Roboflow Workflows API with user's custom model
            const roboflowUrl = 'https://serverless.roboflow.com/grow-hungv/workflows/find-boxes-bags-and-packages';

            console.log('Calling Roboflow Workflows API...');

            const response = await fetch(roboflowUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: 'WLi4t4tNiMsQrofwqaty',
                    inputs: {
                        image: {
                            type: 'base64',
                            value: base64Image
                        }
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Roboflow API error:', errorText);
                throw new Error(`Roboflow API returned ${response.status}`);
            }

            const data = await response.json();
            console.log('Roboflow response:', JSON.stringify(data, null, 2));

            // Extract predictions from Roboflow Workflows response
            const workflowOutput = data.outputs?.[0];
            if (!workflowOutput?.predictions) {
                throw new Error('No predictions in response');
            }

            const predictions: RoboflowPrediction[] = workflowOutput.predictions.predictions.map((pred: any, index: number) => ({
                x: pred.x,
                y: pred.y,
                width: pred.width,
                height: pred.height,
                confidence: pred.confidence,
                class: pred.class,
                class_id: pred.class_id || index,
            }));

            const imageSize = {
                width: workflowOutput.predictions.image.width,
                height: workflowOutput.predictions.image.height,
            };

            console.log(`Successfully detected ${predictions.length} objects`);

            return NextResponse.json({
                success: true,
                predictions: predictions,
                imageSize: imageSize,
                isDemo: false,
            });

        } catch (apiError) {
            console.error('Roboflow API error:', apiError);

            // Return error instead of fallback
            return NextResponse.json(
                { error: 'Failed to detect objects. Please try again.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Detection error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
