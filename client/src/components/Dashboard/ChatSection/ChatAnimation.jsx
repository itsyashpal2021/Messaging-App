import "../../../Css/ChatAnimation.css";

export function ChatAnimation(props) {
  const bubbleCount = 30;
  const animations = ["float-horizontal", "float-vertical", "float-diagonal"];
  const colors = ["#fff685", "#00DDFF", " #59ce8f"];

  const randRange = (min, max) => {
    const rand = Math.random();
    return min + Math.floor((max - min) * rand + 1);
  };

  const radiusArray = [];
  for (let i = 0; i < bubbleCount; i++) {
    radiusArray.push(randRange(10, 100));
  }

  return (
    <div id="bubbles">
      {radiusArray.map((radius, index) => {
        const ind = Math.floor(Math.random() * animations.length);
        const colorInd = Math.floor(Math.random() * colors.length);
        return (
          <div
            className="bubble"
            key={`bubble${index}`}
            style={{
              width: radius,
              height: radius,
              background: colors[colorInd],
              top: randRange(0, window.innerHeight) + "px",
              right: randRange(0, window.innerWidth) + "px",
              animationName: animations[ind],
              animationDelay: Math.random() * 2 + "s",
              animationDirection:
                Math.floor(Math.random() * 3) === 0
                  ? "alternate"
                  : "alternate-reverse",
            }}
          />
        );
      })}
    </div>
  );
}
