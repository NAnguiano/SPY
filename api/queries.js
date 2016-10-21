var parseProperty = function(property) {
    // if (typeof property === 'boolean') {
    //     property = property === true ? '1' : '0';
    // }
    if (property === undefined) {
        property = 'null';
    }
    if (typeof property === 'string' && property === '') {
        property = 'null';
    }
    if (property === 'null') {
        return null;
    } else {
        return property;
    }
};

// *** Postgres allows rows with duplicate data, so currently
// same data inserted twice will be stored in two separate rows
// need to figure out how to "only insert if not exists" implementation
// order of these properties
// must match order of payload properties
var profileProperties = [
    'first_name',
    'last_name',
    'nickname',
    'person_completing_intake',
    'intake_date',
    'hmis_consent',
    'first_time',
    'case_manager',
    'case_manager_id',
    'phone_number',
    'email',
    'date_of_birth',
    'intake_age',
    'provided_id',
    'id_state',
    // reference,
    // services,
    // reference,
    // services,
    // disability,
    // lastGradeCompleted,
    // someCompleted,
    // currentlyAttending,
    // graduated,
    // firstLanguage,
    // preferredLanguage,
    // maritalStatus,
    // militaryService,
    // healthInsurance,
    // gender,
    // genderIdentification,
    // preferredPronoun,
    // ethnicity,
    // race,
    // lastSleepingLocation,
    // lastSleepingDuration,
    // firstDayFirstTimeHomeless,
    // currentHomelessStartDate,
    // currentHomelessLength,
    // homelessEpisodeCount,
    // locationBeforeWestLA,
    // durationInWestLA,
    // housingInstabilityCause,
    // stableHousingObstacle,
    // housingInterest,
    // naturalConnection,
    // contactName,
    // contactPhoneNumber,
    // contactRelationship,
    // currentlyPregnant,
    // firstPregnancy,
    // preNatalCareReceived,
    // preNatalCareLocation,
    // preNatalCareDesired,
    // trimester,
    // babyDueDate,
    // hasOtherChildren,
    // dcfsOpenCase,
    // childrenWithFamilyOrFriends,
    // substanceAbuse,
    // choiceSubstance,
    // injectedDrugs,
    // treatmentInterest,
    // mentalServicesReceived,
    // mentalServicesLocation,
    // mentalMedication,
    // helpAcquiringMedicine,
    // internalReferral,
    // externalReferral,
    // income,
    // birthCity,
    // birthState,
    // birthCountry,
    // employed,
    // lookingForEmployment,
    // fosterCare,
    // socialSecurityNumber,
    // caringForAnimals,
    // goodNeighborContract,
    // storyPhotoVideoAudioForm,
    // informationReleaseAuthorized,
    // servicesConsent,
    // showerInstructions,
    // showerGuidelines,
    // dropInGuidelines,
    // intakeConfirmation,
    // immediateNeedsConfirmation,
    // documentsSigned,
    // sleepingBag,
    // backpack
];

// *** Postgres allows rows with duplicate data, so currently
// same data inserted twice will be stored in two separate rows
// need to figure out how to "only insert if not exists" implementation

var queries = {

    // *** with this implementation, the order of the properties
    // in payload determines the order of the specified column names
    // in the queryString   INSERT INTO client (firstname, nickname, lastname) VALUES ...
    //                                          ^^^^^^^^^  ^^^^^^^^  ^^^^^^^^
    createClient: function (payload) {
        var queryString = 'INSERT INTO client (';
        var payloadNames = [];
        var props = [];
        var params = [];

        var profilePropNames = profileProperties.map(function (element) {
            return element.toLowerCase().replace(/_/g, '');
        });

        for (var property in payload) {
            var index = profilePropNames.indexOf(property.toLowerCase());
            if (index !== -1) {
                props.push(profileProperties[index]);
                payloadNames.push(property);
            }
        }

        props.forEach(function (element, index) {
            queryString += props[index] + ', ';
        });

        queryString = queryString.slice(0, queryString.lastIndexOf(','));
        queryString += ') VALUES (';

        payloadNames.forEach(function (element, index) {
            queryString += '$' + (index + 1) + ', ';
            params.push(parseProperty(payload[payloadNames[index]]));
        });

        queryString = queryString.slice(0, queryString.lastIndexOf(','));
        queryString += ') RETURNING ';

        props.forEach(function (element) {
            queryString += element + ', ';
        });
        
        queryString = queryString.slice(0, queryString.lastIndexOf(','));
        queryString += ';';

        var queryData = {
            string: queryString,
            params: params
        };

        return queryData;

        // var queryString = 'INSERT INTO client (first_name, last_name, nickname,'
        //                 +   'person_completing_intake, hmis_consent, first_time,'
        //                 +   'email, provided_id, state_id) VALUES (';


        // // frontend people are using this for naming standards in their JSON
        // queryString += parseProperty(payload.firstName) + ',';
        // queryString += parseProperty(payload.lastName) + ',';
        // queryString += parseProperty(payload.nickname) + ',';
        // queryString += parseProperty(payload.personCompletingIntake) + ',';
        // // queryString += parseProperty(payload.intakeDate) + ',';
        // queryString += parseProperty(payload.HMISConsent) + ',';
        // queryString += parseProperty(payload.firstTime) + ',';
        // // queryString += parseProperty(payload.caseManager) + ',';
        // // queryString += parseProperty(payload.caseManagerID) + ',';
        // // queryString += parseProperty(payload.phoneNumber) + ',';
        // queryString += parseProperty(payload.email) + ',';
        // // queryString += parseProperty(payload.dob) + ',';
        // // queryString += parseProperty(payload.intakeAge) + ',';
        // queryString += parseProperty(payload.providedID) + ',';
        // queryString += parseProperty(payload.stateID);
        // // queryString += parseProperty(payload.reference) + ',';
        // // queryString += parseProperty(payload.services) + ',';
        // // queryString += parseProperty(payload.disability) + ',';
        // // queryString += parseProperty(payload.lastGradeCompleted) + ',';
        // // queryString += parseProperty(payload.someCompleted) + ',';
        // // queryString += parseProperty(payload.currentlyAttending) + ',';
        // // queryString += parseProperty(payload.graduated) + ',';
        // // queryString += parseProperty(payload.firstLanguage) + ',';
        // // queryString += parseProperty(payload.preferredLanguage) + ',';
        // // queryString += parseProperty(payload.maritalStatus) + ',';
        // // queryString += parseProperty(payload.militaryService) + ',';
        // // queryString += parseProperty(payload.healthInsurance) + ',';
        // // queryString += parseProperty(payload.gender) + ',';
        // // queryString += parseProperty(payload.genderIdentification) + ',';
        // // queryString += parseProperty(payload.preferredPronoun) + ',';
        // // queryString += parseProperty(payload.ethnicity) + ',';
        // // queryString += parseProperty(payload.race) + ',';
        // // queryString += parseProperty(payload.lastSleepingLocation) + ',';
        // // queryString += parseProperty(payload.lastSleepingDuration) + ',';
        // // queryString += parseProperty(payload.firstDayFirstTimeHomeless) + ',';
        // // queryString += parseProperty(payload.currentHomelessStartDate) + ',';
        // // queryString += parseProperty(payload.currentHomelessLength) + ',';
        // // queryString += parseProperty(payload.homelessEpisodeCount) + ',';
        // // queryString += parseProperty(payload.locationBeforeWestLA) + ',';
        // // queryString += parseProperty(payload.durationInWestLA) + ',';
        // // queryString += parseProperty(payload.housingInstabilityCause) + ',';
        // // queryString += parseProperty(payload.stableHousingObstacle) + ',';
        // // queryString += parseProperty(payload.housingInterest) + ',';
        // // queryString += parseProperty(payload.naturalConnection) + ',';
        // // queryString += parseProperty(payload.contactName) + ',';
        // // queryString += parseProperty(payload.contactPhoneNumber) + ',';
        // // queryString += parseProperty(payload.contactRelationship) + ',';
        // // queryString += parseProperty(payload.currentlyPregnant) + ',';
        // // queryString += parseProperty(payload.firstPregnancy) + ',';
        // // queryString += parseProperty(payload.preNatalCareReceived) + ',';
        // // queryString += parseProperty(payload.preNatalCareLocation) + ',';
        // // queryString += parseProperty(payload.preNatalCareDesired) + ',';
        // // queryString += parseProperty(payload.trimester) + ',';
        // // queryString += parseProperty(payload.babyDueDate) + ',';
        // // queryString += parseProperty(payload.hasOtherChildren) + ',';
        // // queryString += parseProperty(payload.dcfsOpenCase) + ',';
        // // queryString += parseProperty(payload.childrenWithFamilyOrFriends) + ',';
        // // queryString += parseProperty(payload.substanceAbuse) + ',';
        // // queryString += parseProperty(payload.choiceSubstance) + ',';
        // // queryString += parseProperty(payload.injectedDrugs) + ',';
        // // queryString += parseProperty(payload.treatmentInterest) + ',';
        // // queryString += parseProperty(payload.mentalServicesReceived) + ',';
        // // queryString += parseProperty(payload.mentalServicesLocation) + ',';
        // // queryString += parseProperty(payload.mentalMedication) + ',';
        // // queryString += parseProperty(payload.helpAcquiringMedicine) + ',';
        // // queryString += parseProperty(payload.internalReferral) + ',';
        // // queryString += parseProperty(payload.externalReferral) + ',';
        // // queryString += parseProperty(payload.income) + ',';
        // // queryString += parseProperty(payload.birthCity) + ',';
        // // queryString += parseProperty(payload.birthState) + ',';
        // // queryString += parseProperty(payload.birthCountry) + ',';
        // // queryString += parseProperty(payload.employed) + ',';
        // // queryString += parseProperty(payload.lookingForEmployment) + ',';
        // // queryString += parseProperty(payload.fosterCare) + ',';
        // // queryString += parseProperty(payload.socialSecurityNumber) + ',';
        // // queryString += parseProperty(payload.caringForAnimals) + ',';
        // // queryString += parseProperty(payload.goodNeighborContract) + ',';
        // // queryString += parseProperty(payload.storyPhotoVideoAudioForm) + ',';
        // // queryString += parseProperty(payload.informationReleaseAuthorized) + ',';
        // // queryString += parseProperty(payload.servicesConsent) + ',';
        // // queryString += parseProperty(payload.showerInstructions) + ',';
        // // queryString += parseProperty(payload.showerGuidelines) + ',';
        // // queryString += parseProperty(payload.dropInGuidelines) + ',';
        // // queryString += parseProperty(payload.intakeConfirmation) + ',';
        // // queryString += parseProperty(payload.immediateNeedsConfirmation) + ',';
        // // queryString += parseProperty(payload.documentsSigned) + ',';
        // // queryString += parseProperty(payload.sleepingBag) + ',';
        // // queryString += parseProperty(payload.backpack) + ')';
        // queryString += ');';
    },

    // ** TODO: paramaterize all of these functions
    // ** parameterize queries!!! Taking user input and using it 
    // directly in the query makes the code vulnerable to SQL injection
    // also, apostraphies in names could throw off syntax

    // This gets called in query.js by Queries module
    getAllCaseManagers: function () {
        var queryString = 'SELECT first_name, last_name FROM casemanager;';
        return queryString;
    },

    getClient: function (clientID) {
        var queryString = 'SELECT first_name, last_name, intake_date, phone_number, email, date_of_birth, age(date_of_birth) FROM client WHERE id = ' +
                            '\'' + clientID + '\'' + ';';
        return queryString;
    },
    
    searchClient: function (firstName, lastName) {
        // console.log(firstName);
        // console.log(lastName);
        var queryString = 'SELECT id, first_name, last_name FROM client WHERE';
        var setFirstName = false;
        if (firstName) {
            queryString += ' first_name = \'' + firstName + '\'';
            setFirstName = true;
        }
        if (lastName) {
            if (setFirstName) {
                queryString += ' AND';
            }
            queryString += ' last_name = \'' + lastName + '\'';
        }
        queryString += ';';

        return queryString;
    },

    getClients: function () {
        var queryString = 'SELECT id, first_name, last_name FROM client;';

        return queryString;
    },

    getDropIns: function () {
        var queryString = 'SELECT id, date FROM drop_in;';

        return queryString;
    },

    getDropIn: function (dropin) {
        var queryString = 'SELECT id, date FROM drop_in WHERE id = ' +
                            dropin + ';';

        return queryString;
    },

    getDropinActivities: function (dropin) {
        var queryString = 'SELECT activity.id, activity.activity_name, match_drop_in_activity.room, ' +
                        'match_drop_in_activity.comments, match_drop_in_activity.start_time, ' +
                        'match_drop_in_activity.end_time FROM activity, match_drop_in_activity ' +
                        'WHERE activity.id = match_drop_in_activity.activity_id AND ' +
                        'match_drop_in_activity.drop_in_id = ' + dropin + ';';
        return queryString;
    },

    getAllActivities: function () {
        var queryString = 'SELECT id, activity_name FROM activity;';

        return queryString;
    },

    getActivity: function (activity) {
        var queryString = 'SELECT id, activity_name FROM activity WHERE id = ' + activity + ';';

        return queryString;
    },

    getActivityDropIns: function (activity) {
        var queryString = 'SELECT drop_in.id, drop_in.date, match_drop_in_activity.room, ' +
                        'match_drop_in_activity.comments, match_drop_in_activity.start_time, ' +
                        'match_drop_in_activity.end_time FROM drop_in, match_drop_in_activity ' +
                        'WHERE drop_in.id = match_drop_in_activity.drop_in_id ' +
                        'AND match_drop_in_activity.activity_id = ' + activity + ';';

        return queryString;
    },

    editClient: function (payload) {
        var queryString = 'UPDATE client SET ';

        queryString += 'first_name = ' + parseProperty(payload.firstName) + ',';
        queryString += 'last_name = ' + parseProperty(payload.lastName) + ',';
        queryString += 'nickname = ' + parseProperty(payload.nickname) + ',';
        queryString += 'hmis_consent = ' + parseProperty(payload.HMISConsent) + ',';
        queryString += 'first_time = ' + parseProperty(payload.firstTime) + ',';
        queryString += 'email = ' + parseProperty(payload.email) + ',';
        queryString += 'provided_id = ' + parseProperty(payload.providedID) + ',';
        queryString += 'state_id = ' + parseProperty(payload.stateID) + ',';
        queryString += 'reference = ' + parseProperty(payload.reference) + ',';

        queryString += 'WHERE id = ' + payload.id; 

        return queryString;
    },

    enroll: function (payload) {
        var queryString = "";
        payload.forEach(function (element) {
            queryString += 'INSERT INTO enrollment (drop_in_id, client_id, activity_id) VALUES( ' +
                            element.dropinID + ', ' +
                            element.clientID + ', ' +
                            element.activityID + '); ';
        });

        return queryString;
    }
};

module.exports = queries;
