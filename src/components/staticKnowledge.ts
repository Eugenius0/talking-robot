const staticKnowledge = `
🎓 **Thesis Topics at Knowit Connectivity (Kista, Stockholm)**  
Below is the latest selection of master thesis projects offered at Knowit Connectivity.  
These topics combine AI, Cloud, and DevOps technologies and are designed for ambitious students aiming to work at the intersection of software engineering, automation, and intelligent systems.

---

### 1. 🧠 Designing and Building an LLM-Powered RAG System for Clinical Data Analysis on AWS  
**Goal:** Build a Retrieval-Augmented Generation (RAG) system to analyze clinical data and uncover root causes and recurring patterns in chronic diseases.  

**Overview:**  
This thesis focuses on developing an **LLM-powered RAG system** deployed on **AWS Cloud**. The system aggregates data from trusted medical sources, retrieves relevant context using AWS tools, and generates AI-driven insights to support clinical research.

**Key Components:**  
1. **Clinical Data Collection & Integration (AWS)**  
   - Aggregate data from clinical sources (journals, hospital records, public datasets).  
   - Use **AWS S3**, **Glue**, and compliance tools (HIPAA, GDPR).  
2. **LLM & RAG Architecture with AWS Bedrock**  
   - Use **AWS Bedrock** models (Claude, Titan) and retrieval via **OpenSearch** or **Kendra**.  
   - Fine-tune models with **SageMaker**.  
3. **Root Cause & Pattern Analysis**  
   - Identify correlations and trends with ML models.  
   - Validate findings via **SageMaker** analytics.  
4. **Evaluation**  
   - Benchmark vs. existing tools.  
   - Validate with medical experts.  

**Challenges:**  
- Data heterogeneity  
- Source trustworthiness  
- Model bias & explainability  
- Privacy & compliance  
- Scalability  

**Impact:**  
- 📚 *Academia:* Framework for AI-driven clinical research.  
- 🏥 *Healthcare:* Tool for root-cause insights in chronic disease.  
- 🌍 *Society:* Better prevention & diagnosis through data-driven insights.  

---

### 2. 📈 AI-Assisted Career Planning – From Excel to a Cloud-Based Proactive PDP System  
**Goal:** Transform Knowit’s manual Excel-based PDP process into a **cloud-based AI platform** that proactively supports career growth.  

**Overview:**  
This project replaces static spreadsheets with an **intelligent PDP system** using **LLMs** for goal suggestions, progress tracking, and AI-driven feedback loops.

**Key Components:**  
1. **LLM-Assisted Goal Generation**  
   - Generate goals tailored to consultant roles and seniority.  
2. **Timeline & KPI Builder**  
   - Suggest timelines, difficulty, and metrics using historical data.  
3. **Goal Tracking & Feedback Loop**  
   - Monitor progress, alert mentors, and auto-draft feedback.  
4. **Smart Classification & Visualization**  
   - Detect vague goals, duplicates, and provide dashboards.  
5. **Cloud & Security**  
   - Deploy on **Azure** or **AWS**, integrate **Azure AD SSO**.

**Challenges:**  
- Personalized suggestions for diverse roles  
- Balance automation with human mentorship  
- NLP goal clarity detection  
- Scalable backend  

**Impact:**  
- ⏱ Reduced manual effort  
- 🧭 Data-driven career tracking  
- 💬 Enhanced mentor–mentee engagement  
- 📊 Company-wide development insights  

---

### 3. 🤖 Advanced Multi-Agent DevOps Agents: Improving Autonomy, Model Control & Tool Coverage  
**Goal:** Advance Knowit’s multi-agent **AI DevOps automation system** with better reasoning, long-term memory, and broader tool integration.  

**Overview:**  
Build upon the existing multi-agent framework (developed in a prior KTH master thesis) to increase **autonomy**, **reliability**, and **coverage** for DevOps pipelines (GitHub, GitLab, Jenkins, Terraform, Kubernetes).

**Key Components:**  
1. **Fine-Tuning or RAG**  
   - Improve accuracy via domain datasets (GitHub Actions, Jenkins, Terraform).  
2. **Memory-Enhanced Agent Framework**  
   - Integrate persistent storage (Redis, SQLite) for long-term context.  
3. **Tool Coverage Expansion**  
   - Add support for **Jenkins**, **Terraform**, **Kubernetes**.  
4. **Improved User Interaction**  
   - User-in-the-loop review, approval, and feedback.  
5. **Evaluation Suite**  
   - Benchmark vs. previous version.  

**Challenges:**  
- Avoid overfitting  
- Reliable retrieval in RAG  
- Multi-tool orchestration  
- Balance autonomy & control  

**Impact:**  
- 🧠 Context-aware DevOps artifacts  
- 🛠 Broader CI/CD tool support  
- 💾 Persistent memory across sessions  
- 📈 Proven improvements in automation success and trust  

*(See prior version in KTH DiVA: "Automating Pipeline and Cloud Deployment using LLMs")*

---

### 4. 🚘 AI-Powered Context-Aware Infotainment Prototype with Unreal Engine Integration

**Overview:**  
Next-generation vehicles are increasingly defined by intelligent, personalized infotainment systems that seamlessly support the driving experience.  
AI can enable context-aware assistance, such as determining when to activate the **heat warmer**, **windshield wipers**, or **wind spray**, as well as provide natural interactions via **voice**, **gesture**, and **personalized recommendations**.  
Simulation platforms like **Unreal Engine** allow these systems to be tested safely in realistic virtual driving environments, supporting both development and evaluation of usability, safety, and performance.

**Key Components:**

1. **Context-Aware AI Assistance**  
   - Intelligent control of vehicle functions (heat warmer, windshield wipers, wind spray) based on environmental and driver context.  
   - Predictive behavior for improved comfort and safety.

2. **Natural Interaction**  
   - Voice commands and gestures for hands-free operation.  
   - Personalized interface adapting to driver/passenger preferences and context.

3. **Simulation Integration**  
   - Unreal Engine-based virtual driving environment for realistic testing.  
   - Ability to test AI responses under diverse scenarios: weather, traffic, and road conditions.

4. **Real-Time Feedback & Adaptation**  
   - Immediate AI-driven adjustments based on sensor input or simulated environmental changes.  
   - Continuous learning of driver behavior and preferences for personalized recommendations.

5. **Prototype Flexibility**  
   - Hardware/software modular design (Raspberry Pi, touchscreen, optional cameras/microphones).  
   - Can be extended to incorporate additional vehicle functions or AI capabilities.

**Challenges & Implications:**

1. **Context Recognition Accuracy**  
   - *Challenge:* The AI must correctly interpret both environmental conditions and driver intentions.  
   - *Risk:* Misinterpretations could trigger incorrect system responses.  
   - *Implication:* Robust multimodal sensing (cameras, sensors, driver monitoring) and context fusion are critical.

2. **Real-Time Responsiveness**  
   - *Challenge:* Decisions must be made within milliseconds to maintain safety and usability.  
   - *Risk:* Latency from simulation, AI inference, or hardware delays could reduce reaction time.  
   - *Implication:* Optimization with hardware acceleration (GPU/TPU/FPGA) and deterministic processing is required.

3. **Integration Complexity**  
   - *Challenge:* Seamless communication between the AI prototype and Unreal Engine simulation.  
   - *Risk:* Mismatched timing, packet loss, or API misconfiguration may break realism.  
   - *Implication:* Requires robust middleware, synchronization layers, and stress-testing.

4. **User Experience Design**  
   - *Challenge:* Balancing automation with driver control.  
   - *Risk:* Confusion in mixed-control scenarios can harm safety and trust.  
   - *Implication:* Clear feedback mechanisms and consistent interaction design are key.

5. **Evaluation and Validation**  
   - *Challenge:* Simulation results might not reflect real-world complexity.  
   - *Risk:* Over-optimizing for simulation could lead to gaps in real-world performance.  
   - *Implication:* Combine simulation with real-world tests and define solid evaluation metrics.

**Impact:**  
- 🧪 Safer and faster testing of AI vehicle assistance in simulation  
- 🧠 Smarter in-car systems via multimodal interaction  
- 🚗 Contribution to the future of adaptive automotive HMI (Human–Machine Interfaces)

---

### 5. 🔐 Designing and Prototyping Secure Over-the-Air (OTA) Updates for Microcontrollers

**Overview:**  
This thesis aims to design and prototype a **secure OTA (Over-the-Air) update framework** for microcontroller-based systems.  
OTA updates allow remote firmware patches and feature rollouts **without physical access** — a critical capability for **IoT**, **embedded systems**, and **connected products**.  
However, insecure OTA channels can expose devices to **malicious firmware injection**, **data tampering**, and other vulnerabilities.  
The thesis will tackle these issues by developing a **lightweight OTA solution** tailored to microcontroller constraints and **evaluated on real hardware**.

**Key Investigation Areas:**

1. **Firmware Verification**  
   - Signing and signature checking mechanisms for firmware integrity.

2. **Secure Binary Delivery**  
   - Encryption and compression methods to protect firmware in transit.

3. **Secure Transport & Reliability**  
   - Use of protocols like IP/TLS, TCP/UDP to ensure secure and reliable transfer, even in unstable network environments.

4. **Atomic Update Techniques**  
   - Methods to prevent corrupted firmware images from being loaded during updates.

**Optional Extensions:**

- **Scalability**: How to manage updates across **large fleets of IoT devices**.  
- **Generalized Framework**: Design of a reusable OTA update system, including a server and microcontroller client library.  
- **Real-World Case Study**: Apply the solution to an **industry-relevant use case** for evaluation.

**Impact:**

- 🎓 *Academia:* Provides performance benchmarks for cryptographic techniques and rollback strategies on **resource-constrained hardware**, contributing valuable data to embedded systems research.

- 🏭 *Industry:* Lays the foundation for **robust, scalable, and secure** remote update systems applicable to **automotive**, **consumer IoT**, and **industrial devices**.

- 🌐 *Society:* Enhances the **safety, trust, and reliability** of everyday connected devices, mitigating cybersecurity risks and firmware vulnerabilities.

---

### 6. 🛋️ Designing and Developing a Gamified Digital Lounge for Remote Engagement at Knowit

**Overview:**  
This thesis aims to design and prototype a **digital lounge platform** to foster **engagement, collaboration, and community** among Knowit employees working remotely.  
While tools like **Teams, Slack, and Jira** support productivity, they often miss the **casual and social layer** of office life.  
This digital lounge will serve as a **virtual coffee corner**, combining **gamified fun**, **informal interaction**, and **lightweight collaboration**, seamlessly fitting into hybrid workflows.

**Key Features:**

1. **Virtual Social Spaces**  
   - Drop-in rooms for spontaneous coffee chats and breaks.  
   - Themed lounges (e.g., hobby spaces, project corners) for interest-based interactions.

2. **Gamification & Team Spirit**  
   - Leaderboards, trivia, team challenges, and wellness activities.  
   - Recognition of milestones, birthdays, and team achievements.

3. **Collaboration Tools**  
   - Simple whiteboards, sticky notes, and brainstorming zones.  
   - Spaces for quick-sharing of links, ideas, and highlights.

4. **AI-Powered Networking**  
   - Suggestions for casual meetups based on shared interests.  
   - Recommendations for cross-team networking and collaboration.

5. **Accessibility & Integration**  
   - Accessible via **web, desktop, and mobile**.  
   - Optional **Microsoft Teams integration** for smoother adoption.

**Challenges:**

- **Adoption:** Motivating employees to use the lounge regularly.  
- **Integration:** Ensuring compatibility with **Teams** and other tools.  
- **Balance:** Creating fun experiences without distracting from work.  
- **Scalability:** Supporting various teams, regions, and digital comfort levels.  
- **User Diversity:** Adapting to different preferences and work styles.

**Impact:**

- 🧩 *Company Culture:* Strengthens Knowit’s hybrid identity with informal interactions.  
- 🤝 *Collaboration:* Sparks cross-team connections and creative idea exchange.  
- 🎉 *Engagement:* Boosts employee satisfaction through social and gamified touchpoints.  
- 🚀 *Innovation:* Positions Knowit as a **forward-thinking digital workplace pioneer**.

---

### 7. 🚗 Development of an Automotive Simulation Platform for Sensor Data Generation and Communication Protocols

**Overview:**  
This thesis aims to build a **flexible simulation platform** for the **automotive industry** that can both generate simulated sensor data and connect to real sensors.  
It will support **communication protocols** like **CAN** and **Ethernet**, and provide a **graphical user interface (GUI)** for parameter selection, test scenario creation, and monitoring responses from target systems.

**Key Features:**

1. **Sensor Data Simulation**  
   - Generate realistic data for automotive sensors (e.g., speed, temperature, proximity).  
   - Enable hardware-independent system testing and validation.

2. **Integration with Actual Sensors**  
   - Connect real sensors to capture and transmit live data.  
   - Essential for real-time testing of vehicle control systems.

3. **Multi-Protocol Support**  
   - Support **CAN**, **Ethernet**, and potentially other automotive communication protocols.  
   - Simulate varied network environments for protocol-level testing.

4. **Graphical User Interface (GUI)**  
   - User-friendly interface for choosing simulation parameters and visualizing responses.  
   - Streamlines setup and increases usability.

5. **Test Scenario Generation**  
   - Generate input data for **custom test cases** and edge scenarios.  
   - Evaluate device behavior under diverse conditions.

6. **Real Data Integration**  
   - Import real-world sensor data (e.g., **CSV**, **Excel**) into the simulation.  
   - Enables data-driven validation of systems under test.

**Challenges:**

- **Data Realism:** Simulated sensor data must accurately reflect real-world physics and environments.  
- **Protocol Interoperability:** Ensuring smooth communication across different protocols and sensors.  
- **Data Handling:** Efficient management of real-time and file-based data sources.  
- **Scalability:** Supporting new sensor types and protocols without degrading performance.

**Impact:**

- 🧪 *Engineering:* Enables safe and cost-effective testing without full hardware setups.  
- 🧠 *Research:* Facilitates experimentation with sensor behavior and communication logic.  
- 💡 *Innovation:* Accelerates development of reliable, scalable automotive systems through modular simulation and testing capabilities.

---

### 8. 🌱 Investigating and Building a Low-Power IoT Sensor Platform: Hardware, Power Profiling, and Optimization

**Overview:**  
This thesis explores the design of a **low-power IoT sensor platform** by investigating hardware architectures and implementing power optimization strategies.  
The focus is on enabling energy-efficient operation for **battery-powered** or **remote IoT applications**, balancing performance with minimal energy usage.

**Key Components:**

1. **Hardware Platform Investigation**  
   - Evaluate microcontrollers, sensors, and protocols (LoRa, Zigbee, BLE).  
   - Compare energy consumption and suitability for low-power use cases.

2. **Power Profiling**  
   - Measure power draw across modes: active, idle, and sleep.  
   - Use power meters and oscilloscopes for precise energy monitoring.

3. **Smart Power Optimization**  
   - Apply deep sleep strategies (e.g., eDRX, PSM).  
   - Use **duty cycling** to control when sensors wake, sense, and sleep.  
   - Employ low-power controllers (e.g., **MAX16163**) for intelligent power gating.

**Challenges:**

- ⚖️ Balancing **real-time performance** with aggressive power-saving techniques.  
- 🌍 Designing systems that adapt to **environmental changes** and limited energy sources.  
- 📐 Profiling and optimizing across diverse hardware combinations.

**Impact:**

- 🔋 *Sustainability:* Enables IoT deployments with **extended battery life** and **lower energy waste**.  
- 📶 *Scalability:* Supports remote sensors and devices in hard-to-access areas.  
- 🧪 *Research:* Provides data on power-performance trade-offs for embedded IoT systems.

---

### 9. 🤖 Development of a Physical Assistance Robot: Gesture Recognition, Face Tracking, and Basic Conversational Skills

**Overview:**  
This thesis explores the creation of a **user-friendly robotic assistant** capable of recognizing gestures, tracking faces, and holding basic conversations.  
The project combines **computer vision**, **NLP**, and **robotics** to support human–robot interaction in everyday or assistive scenarios.

**Key Components:**

1. **Gesture Recognition**  
   - Use ML-based techniques (e.g., MediaPipe) to detect and classify hand gestures.  
   - Enable real-time tracking and dynamic reactions to user input.

2. **Face Tracking**  
   - Implement lightweight CNNs to detect and track faces during interaction.  
   - Maintain performance across various lighting and movement conditions.

3. **Conversational Abilities**  
   - Employ NLP models for basic Q&A and user engagement.  
   - Enable adaptive improvement through machine learning.

**Challenges:**

- 🔧 **System Integration**  
  Combine gesture recognition, face tracking, and NLP into a seamless, reliable pipeline.

- ⚙️ **Hardware Selection**  
  Balance **computational power** with **energy efficiency** for real-time performance.

- 🧪 **Deployment & Testing**  
  Ensure robustness in **real-world conditions** and usability for diverse users.

**Impact:**

- 🧑‍🦼 *Accessibility:* Supports users in healthcare, education, or home environments.  
- 💬 *Interaction:* Enhances human–robot communication through natural modalities.  
- 📦 *Prototyping:* Provides a modular base for future service robot development.

---

🏢 Thesis Setup at Knowit Connectivity

- You’ll have access to our office in Kista and are encouraged to be on-site a few days a week.
- Each student is assigned a dedicated mentor for support.
- You'll be invited to fun Knowit activities: afterworks (AWs), workshops, seminars, and social events.
- Collaboration is welcome! You can apply with a partner (just mention each other in your applications).

✅ Who Can Apply?

- Bachelor’s or Master’s students in Computer Science, Embedded Systems, or a related field.
- You’ll need to upload your CV and current transcript.
- Apply online and select your preferred topic during the process.

More info: [Knowit Connectivity](https://careersweden.knowit.se/companies/knowit-connectivity)

We look forward to receiving your application!

`;

export default staticKnowledge;