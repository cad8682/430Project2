const models = require('../models');
const Eevee = models.Eevee;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makeEevee = async (req, res) => {
    if (!req.body.name || !req.body.level) {
        return res.status(400).json({ error: 'Both name and level are required!' });
    }

    let randomEvo = Math.floor(Math.random() * 8);
   switch (randomEvo) {
        case 0:
            //Vaporeon
            req.body.evolvesInto = 'Vaporeon';
            break;
        case 1:
            //Jolteon
            req.body.evolvesInto = 'Jolteon';
            break;
        case 2:
            //Flareon
            req.body.evolvesInto = 'Flareon';
            break;
        case 3:
            //Espeon
            req.body.evolvesInto = 'Espeon';
            break;
        case 4:
            //Umbreon
            req.body.evolvesInto = 'Umbreon';
            break;
        case 5:
            //Leafeon
            req.body.evolvesInto = 'Leafeon';
            break;
        case 6:
            //Glaceon
            req.body.evolvesInto = 'Glaceon';
            break;
        case 7:
            //Sylveon
            req.body.evolvesInto = 'Sylveon';
            break;
   }

    const eeveeData = {
        name: req.body.name,
        level: req.body.level,
        species: 'Eevee',
        evolvesInto: req.body.evolvesInto,
        owner: req.session.account._id,
    };

    try {
        const newEevee = new Eevee(eeveeData);
        await newEevee.save();
        return res.status(201).json({name: newEevee.name, level: newEevee.level, species: newEevee.species, evolvesInto: newEevee.evolvesInto});
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'That Eevee already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making Eevee! '});
    }
}

const getEevees = async (req, res) => {
    try {
        const query = {owner: req.session.account._id};
        const docs = await Eevee.find(query).select('name level species evolvesInto').lean().exec();

        return res.json({eevees: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving Eevees!'});
    }
};

const evolveEevee = async (req, res) => {
    try {
        const eevee = await Eevee.findOne({
            _id: req.params.id,
            owner: req.session.account._id,
        });
    
        eevee.species = eevee.evolvesInto;
        eevee.evolvesInto = null;
    
        await eevee.save();
    
        return res.json(eevee);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred evolving Eevee!' });
    }
};

module.exports = {
    makerPage,
    makeEevee,
    getEevees,
    evolveEevee,
}