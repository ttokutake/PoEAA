const List = () => {
  const crews = [
    { name: "Luffy", bounty: 1_500_000_000 },
    { name: "Zoro", bounty: 320_000_000 },
  ];
  return React.createElement(
    "ul",
    null,
    crews.map(({ name, bounty }, index) =>
      React.createElement("li", { key: index }, `${name} ${bounty}`)
    ),
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(List));
