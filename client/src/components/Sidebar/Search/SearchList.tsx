import SearchListItem from "./SearchListItem";

const dummyUsers = [
  {
    name: "Oleksandr",
    username: "sasha_dev",
    avatar: "https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg",
  },
  {
    name: "Lewa",
    username: "lewa222",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoDim25Sj5loXJbpYM0NKMZI2geNtFbDme5A&s",
  },
  {
    name: "Max",
    username: "max_power",
    avatar: "https://cdn.omlet.com/images/originals/breed_abyssinian_cat.jpg",
  },
];

export default function SearchList() {
  return (
    <ul className="flex flex-col px-[1rem] py-[0.5rem] gap-[0.3rem]">
      {dummyUsers.map((user, index) => (
        <SearchListItem
          key={index}
          name={user.name}
          username={user.username}
          avatar={user.avatar}
        />
      ))}
    </ul>
  );
}
