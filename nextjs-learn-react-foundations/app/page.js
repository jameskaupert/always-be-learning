import LikeButton from './like-button';
function Header({ title }) {
    console.log(title)
    return (<h1>{title ? title : 'Develop. Preview. Ship.'}</h1>)
}

export default function HomePage() {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton']

    return (<div>
        <Header />
        <ul>
            {names.map((name) => (
                <li key={name}>{name}</li>
            ))}
        </ul>
        <LikeButton />
    </div>);
}
