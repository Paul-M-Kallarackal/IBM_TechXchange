# GigStone

GigStone is an innovative solution developed by team Moriatz for the IBM TechXChange hackathon. It aims to maximize productivity through advanced AI-powered features.

**Important Note**: If the API calls are not currently running, it is due to Paul's computer not being connected to the internet/power and the ngrok tunnel not working.

## Features

- **RAG-based Knowledge Base**: Utilizes Retrieval-Augmented Generation for efficient information retrieval and knowledge management.
- **Order Summarization**: Provides concise summaries of orders to streamline decision-making processes.
- **Personalized Response Generation**: Creates tailored responses based on user preferences and context.
- **Task Prioritization**: Intelligently organizes tasks to optimize workflow and productivity.

## Technology Stack

- **Frontend**: Next.js
- **Backend**: Flask
- **AI/ML**: Langchain, IBM WatsonX SDK
- **Deployment**: Vercel (frontend), Ngrok (backend)

## Live Demo

[Live Demo Link](https://moriatz.vercel.app)

## IBM Prompt Jupyter Notebook

[Jupyter Notebook Link](https://dataplatform.cloud.ibm.com/analytics/notebooks/v2/2a51667c-e02f-4617-b99b-cca34c2c011d/view?access_token=0e665beac93a7d3dba7fe4a370b02bd15c4b676867b4d4cc6600cd1a882008a9&context=wx)

## Getting Started

### Prerequisites

- Node.js
- Python 3.7+
- IBM Cloud account

### Installation

1. **Install frontend dependencies:**
    ```sh
    cd client
    npm install
    ```

2. **Install backend dependencies:**
    ```sh
    cd server
    pip install -r requirements.txt
    ```

3. **Set up environment variables**

### Running the Application

1. **Start the frontend:**
    ```sh
    cd client
    npm run dev
    ```

2. **Start the backend:**
    ```sh
    cd server
    python main.py
    ```

3. **Access the application at** [https://moriatz.vercel.app](https://moriatz.vercel.app)

## Acknowledgments

- IBM TechXChange hackathon organizers
- IBM WatsonX team for their powerful AI tools
- All contributors and team members of Moriatz