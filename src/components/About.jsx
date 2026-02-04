import "../css/index.css";

const Aboutproject = () => {
  return (
    <div className="h-full w-full border-[0.1px] border-solid border-[#b6b3b3] box-border overflow-y-auto relative about-wrapper font-roboto">
      <div className="max-w-[90%] mx-auto my-4 p-6 background-app leading-[1.6]">
        <h1 className="text-2xl mt-8 mb-4 text-[#feffff] align-center">
          Behind the Voice – The Making of Abhay AI
        </h1>

        <p className="mb-4 text-base text-[#eceef0]">
          This project is more than just a portfolio — it's a deeply personal
          innovation where voice meets intelligence. "Abhay AI" is a
          voice-based portfolio assistant that simulates a real-time AI
          conversation, making your experience with my work interactive and
          futuristic.
        </p>

        <h2 className="text-[1.3rem] mt-8 mb-3 text-[#feffff]">
          👨‍💻 What This Project Is About
        </h2>
        <p className="mb-4 text-base text-[#eceef0]">
          At its core, this project is a React-based portfolio website enhanced
          with a voice-calling AI interface. Users can talk to "Abhay's AI,"
          ask questions about me, my work, or anything defined in my backend
          JSON data, and receive real-time spoken responses. This makes browsing
          my portfolio not only engaging but also immersive and smart.
        </p>

        <h2 className="text-[1.3rem] mt-8 mb-3 text-[#feffff]">
          🧠 Technologies Behind the Magic
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">ReactJS:</strong> For the
            frontend user interface with a mobile-first design approach.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">Recoil:</strong> To manage state
            across components like the sidebar and voice status.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">Web Speech API:</strong>{" "}
            Integrated for <em>speech-to-text</em> (voice input) and{" "}
            <em>text-to-speech</em> (AI output).
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">OpenAI API:</strong> The heart of
            the AI brain — all questions are sent to OpenAI's GPT model for
            smart responses.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">Token Management:</strong> Every
            conversation uses tokens on OpenAI's side — this isn’t free. I’ve
            handled caching, token-efficient structuring, and cost optimization
            throughout.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">Node.js + Express:</strong> For
            the backend API that serves my structured JSON portfolio data and
            handles routing securely.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            <strong className="text-[#ffffff]">Lottie & Tailwind CSS:</strong>{" "}
            For responsive animations and a cleaner user experience.
          </li>
        </ul>

        <h2 className="text-[1.3rem] mt-8 mb-3 text-[#feffff]">
          💥 The Challenges I Faced
        </h2>
        <p className="mb-4 text-base text-[#eceef0]">
          Building this project was no small feat. I encountered several deep
          challenges:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2 text-[#e5f2ff]">
            Mastering and synchronizing the Web Speech API with React's
            rendering cycle.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            Getting OpenAI responses to sound natural and context-aware — while
            also minimizing API token costs.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            Creating a realistic voice interface with loading animations and a
            call timer.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            Implementing smart UI/UX with conditional logic for mobile-view
            frames and dynamic routing.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            Designing sidebar logic to open/close with smooth animations while
            syncing the navigation flow.
          </li>
          <li className="mb-2 text-[#e5f2ff]">
            Writing clean code with reusable components and proper file
            structure while under a tight self-imposed deadline.
          </li>
        </ul>

        <h2 className="text-[1.3rem] mt-8 mb-3 text-[#feffff]">
          🌐 Why This Project Matters
        </h2>
        <p className="mb-4 text-base text-[#eceef0]">
          As an aspiring developer, I wanted to build something different — not
          just another site, but something that reflects the future. This
          AI-powered portfolio brings emotion, tech, and interaction into one
          canvas. I genuinely want people to feel inspired and curious while
          exploring my work.
        </p>

        <h2 className="text-[1.3rem] mt-8 mb-3 text-[#feffff]">
          📁 Source Code
        </h2>
        <p className="mb-4 text-base text-[#eceef0]">
          You can explore the entire source code on my GitHub:
          <br />
          <a
            className="text-[#74e8c1] hover:underline"
            href="https://github.com/apy2704"
            target="_blank"
            rel="noopener noreferrer"
          > 
          </a>
        </p>

        <h2 className="text-[1.3rem] mt-8 mb-3 text-[#feffff]">📞 Contact</h2>
        <p className="mb-9">
          If you’d like to discuss this project or need any insights, feel free
          to contact me at:
          <br />
          <span className="mt-1 text-base">
            <b>Phone:</b> <b className=" text-[#bd9f9f]">9109494819</b>
          </span>
        </p>
      </div>
      <div className="relative p-4 bottom-5 w-full text-[0.8rem] text-[#aaa]">
        © 2026 Abhay Pratap Yadav —Made with ❤️
      </div>
    </div>
  );
};

export { Aboutproject };
