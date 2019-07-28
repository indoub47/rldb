return res.status(500).send(error);
res.status(400).send({ msg: "name must be unique" });

return res.status(400).send({errors: validation});

{message: "Checking version error"}

return res.status(400).json({
    ok: 0,
    reason: "bad draft",
    errors: result.errors
});

return res.status(500).send({
  ok: 0,
  reason: "server error",
  msg: "Nepavyko redaguoti objekto DB"
});

return res.status(500).send({
  ok: 0,
  reason: "server error",
  msg: "Nepavyko įrašyti naujo objekto į DB"
});

return res.status(500).send({
  ok: 0,
  reason: "unknown",
  msg: `${coll.itemNames.Item} nebuvo pašalintas, nes arba įvyko serverio klaida, arba toks id nerastas, arba nesutampa versijos.`
});

return res.status(400).send({
    ok: 1,
    msg: "Rezultatų nerasta."
  });
} 

return res.status(400).send({
  ok: 0,
  msg: "Per daug rezultatų. Siaurinkite užklausą."
});
}

return res.status(200).send({
  ok: 1,
  msg: `${coll.itemNames.Item}, kurio id ${req.query.id}, pašalintas`,
  id: parseInt(req.query.id)
}); 

return res.status(404).send("no collection");

return res.status(404).send({
  msg: "čia yra bendri duomenys, o tu gali keisti išimtinai tik savo regiono duomenis"
});

return res.status(404).send({
  msg:
    "Čia bendri duomenys, o tau leidžiama kurti duomenis tiktai savo regionui. Kreipkis į superadminą. Soriukas :)"
});

return res.status(404).send({
  msg:
    "Čia bendri duomenys, o tau leidžiama trinti tik išskirtinai savo regiono duomenis. Kreipkis į superadminą. Soriukas :)"
});

return res.status(500).send({ msg: "not inserted" });

return res.status(404).send({ msg: "tu neturi teisės trinti" });

return res.status(404).send({ msg: "neturi teisės keisti" });

return res.status(500).send({ ...err, msg: "bbz... :/" });

if (!coll) return res.status(404).send({ msg: "collection not found" });

return res.status(500).send({
  ok: 0,
  reason: "server error",
  msg: "operacija nepavyko"
});

if (!found) {
  item.validation = {reason: "not found"};
} else if (found.v !== item.main.v) {
  item.validation = {reason: "bad version"};
} else if (checkSamePlace(coll, "update", item.main, regbit, db)) {
  item.validation = {reason: "same place"}
}

message:
      "Periodo pradžios data negali būti vėlesnė už periodo pabaigos datą"
  };


return res.status(400).json({email: "Email already exists"});


return res.status(500).send({message: "insert unsuccessful"});

const badLoginResponse = { message: "wrong email or password" };

return res.status(404).send({
  ok: 0,
  reason: "bad criteria",
  msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes yra ištrintas iš serverio`
});



return res.status(500).json({
  ok: 0,
  reason: "server error",
  msg: "Serverio klaida, mėginant atsisiųsti originalų objektą"
});


return res.status(409).send({
  ok: 0,
  reason: "bad criteria",
  msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
});

return res.status(403).send({
    ok: 0,
    reason: "bad criteria",
    msg: `tu neturi teisės ${actionName} ${res.locals.coll.itemNames.Item} įrašų`
  });

return res.status(400).send({
  ok: 0,
  reason: "bad draft",
  msg: `${coll.itemNames.Item} ${msgUndone} - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceItem.id}`
});

return res.status(500).send({
  ok: 0,
  reason: "server error",
  msg: `Serverio klaida, mėginant patikrinti, ar toje pačioje vietoje yra kitas ${coll.itemNames.item}`
});


return res.status(200).send({
  ok: 1,
  msg: `${coll.itemNames.Item}, kurio ID ${mainId}, sėkmingai ${msgAtliktas}`,
  item: {main: resultMain, journal: resultJournal}
});

return res.status(200).send({
  ok: 0,
  reason: "server error",
  msg: `${coll.itemNames.Item}, kurio ID ${mainId}, buvo ${msgAtliktas}, bet mėginant atsisiųsti įrašą iš DB, įvyko DB klaida. Siūloma atnaujinti įrašus programoje`,
  item: {draftMain, drafJournal}
});

if (!coll) return res.status(400).send({
  ok: 0,
  reason: "bad criteria",
  msg: "no collection " + itype
});

info: {message: "Įrašai sėkmingai pateikti", type: "success"}
        
info: {message: "Pateikti įrašai sėkmingai įkelti", type: "success"}

error: {message: "Įvyko nesuprantama klaida"},

successmsg: "atnaujinta sėkmingai"
successmsg: "sukurta sėkmingai"
successmsg: `id ${id} panaikinta sėkmingai`

return "Kažkokia klaida";

dispatch(reportFailure({ errormsg: "Unknown report type" }));
({ errormsg: "Name must be not empty" });
errormsg: `Same name as ${sameNameQuery.id}; name must be unique`
this.setState({journal, jItem: {}, jAlert: {msg: "įrašas sėkmingai pakeistas/pridėtas", type: "success"}});
this.setState({journal, jToDelete, jItem: {}, jAlert: {msg: "įrašas ištrintas", type: "success"}});
<div className="alert alert-info">There's no items for this view.</div>

body="Please confirm that you really want to delete this item from database."

No journal as yet
Copyright &copy; {new Date().getFullYear()} RLDB
<h1 className="display-3 mb-4">Rail Defect Data Base
<p className="lead">Manage your data with confidence</p>
Rail Defect Data Base
Manage your data with confidence
You're logged-in, and now you can start working


  ______________________________________________________________________

throw Error("Error while inserting main");
throw Error("Error while inserting journal");
throw Error("Error while shifting main version");
throw Error("Error while inserting unapproved");
throw Error("Error while inserting withErrors");
throw Error("Error while deleting supplied");
throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);

__________________________________________________________

errors.email = 'email can not be empty';
errors.password = 'password can not be empty';
errors.message = 'wrong email or password';
errors.name = 'name is required';
errors.name = 'name must be between 2 and 30 characters';
errors.email = 'email is required';
errors.email = 'email can not be longer than 200 characters';
errors.email = 'email must be a valid email';
errors.role = 'role is required';
errors.role = 'invalid role; allowed roles are: dev, adm, superadm, oper, viewer';
errors.region = 'region is region';
errors.region = 'invalid region; allowed regions are: 1, 2, 3, 4';
errors.password = 'password is required';
errors.password = 'password must be between 6 and 30 characters';
errors.password2 = 'confirm password is required';
errors.password2 = 'passwords must match';
throw { message: "bad value" };
throw { message: "value must be an integer" };
throw { message: "value must be a number" };
msg: () => "must be not empty"
msg: params => `length must be ${params.min}-${params.max} characters`
msg: () => "must be not negative"
msg: params => `must be ${params.min}-${params.max} `
msg: () => "must be four-digit year"
msg: () => "must be valid date (yyyy-mm-dd)"
msg: () => "must be valid short date (yyyy-mm-dd) or empty"
return {error: "is required"};