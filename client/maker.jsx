const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleEevee = (e, onEeveeAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#eeveeName').value;
    const level = e.target.querySelector('#eeveeLevel').value;

    if (!name || !level) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, level}, onEeveeAdded);
    return false;
};

const EeveeForm = (props) => {
    return (
        <form id="eeveeForm"
            name="eeveeForm"
            //When bug fixing I was told to switch to this by ChatGPT, my code works, I'm hesitant to change back
                //even if I don't think this caused any issues
            //onSubmit={(e) => handleEevee(e, OptimizationStages.triggerReload)}
            onSubmit={(e) => handleEevee(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className="eeveeForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="eeveeName" type="text" name="name" placeholder="Eevee Name" />
            <label htmlFor="level">Level: </label>
            <input id="eeveeLevel" type="number" min="0" name="level" />
            <input className="makeEeveeSubmit" type="submit" value="Make Eevee" />
        </form>
    );
};

const EeveeList = (props) => {
    const [eevees, setEevees] = useState(props.eevees);

    useEffect(() => {
        const loadEeveesFromServer = async () => {
            const response = await fetch('/getEevees');
            const data = await response.json();
            console.log("Fetched Eevees:", data.eevees);
            setEevees(data.eevees);
        };
        loadEeveesFromServer();
    }, [props.reloadEevees]);

    //ChatGPT helped make evolveEevee
    const evolveEevee = async (id) => {
        try {
            const response = await fetch(`/api/evolveEevee/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to evolve Eevee');
                return;
            }

            const updatedEevee = await response.json();

            setEevees((prevEevees) =>
                prevEevees.map((eevee) =>
                    eevee._id === updatedEevee._id ? updatedEevee : eevee
                )
            );
        } catch (err) {
            console.error('Error evolving Eevee:', err);
        }
    };

    if(eevees.length === 0) {
        return (
            <div className="eeveeList">
                <h3 className="emptyEevee">No Eevees Yet!</h3>
            </div>
        )
    }

    const eeveeNodes = eevees.map(eevee => {
        return (
            <div key={eevee._id} className="eevee">
                <img src={`/assets/img/${eevee.species.toLowerCase()}Icon.webp`} alt={`${eevee.species} face`} className={`${eevee.species.toLowerCase()}Icon`} />
                <h3 className="eeveeName">Name: {eevee.name}</h3>
                <h3 className="eeveeSpecies">Species: {eevee.species}</h3>
                <h2 className="eeveeLevel">Level: {eevee.level}</h2>
                {/*ChatGPT helped me make the evolution button disappear after the evolution happens*/}
                {eevee.evolvesInto && (
                    <button onClick={() => evolveEevee(eevee._id)}>Evolve</button>
                )}
            </div>
        );
    });

    return (
        <div className="eeveeList">
            {eeveeNodes}
        </div>
    );
};

const App = () => {
    const [reloadEevees, setReloadEevees] = useState(false);

    return (
        <div>
            <div id="makeEevee">
                <EeveeForm triggerReload={() => setReloadEevees(!reloadEevees)} />
            </div>
            <div id="eevees">
                <EeveeList eevees={[]} reloadEevees={reloadEevees} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;