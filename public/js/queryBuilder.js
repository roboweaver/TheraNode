
/* global Selectize */

// This is what we get back from the server
var results;
var infxTypeResults = [{
    "EVENT_TYPE": "",
        "EVENT_DESCRIPTION": "Pick something"
}];

// We just need the rows array of objects
var rows;

var baseURL = 'http://45451RWEAVER-W7.theradoc.com:3000';
var infxClassAPI = baseURL + '/infxClass/';
var infxTypeAPI = baseURL + '/event/parent/';
var selectInfxType;
var xhr;

var $infxTypeSection = $('#infxTypeSection');
$infxTypeSection.hide();

// Infection type selector ...
var $selectInfxType = $('#infxType').selectize({
    delimiter: ',',
    persist: false,
    maxItems: 1,
    options: infxTypeResults,
    labelField: "EVENT_DESCRIPTION",
    valueField: "EVENT_TYPE",
    searchField: ["EVENT_TYPE", "EVENT_DESCRIPTION"],
});

// Get the infection classes ...
jQuery.getJSON(infxClassAPI)
    .done(function (data) {
    // Should have the full list now
    console.log(data);
    rows = data;
    $('#infxClass').selectize({
        delimiter: ',',
        persist: false,
        maxItems: 1,
        options: rows,
        labelField: "DESCRIPTION",
        valueField: "ABBREV",
        searchField: ["ABBREV", "DESCRIPTION"],
        onChange: function (value) {
            if (!value.length) return;
            console.log('Selected ' + value);
            selectInfxType.disable();
            selectInfxType.clearOptions();
            jQuery.getJSON(infxTypeAPI + value)
                .done(function (infxTypeData) {
                console.log(infxTypeData);
                // Only update the selector if we have data
                if (!infxTypeData.length) {
                    $infxTypeSection.hide();
                    return;
                }
                // Loop through the data and populate the list
                jQuery.each(infxTypeData, function (row, rowValue) {
                    console.log(rowValue);
                    selectInfxType.addOption(rowValue);
                });
                $infxTypeSection.show();
                selectInfxType.enable();
            });
        }
    });
});

selectInfxType = $selectInfxType[0].selectize;
selectInfxType.disable();

/** 
 * ===================================================================
 *  Query builder
 * ===================================================================
 * 
 */
var baseURL = 'http://localhost:3000';
var infxClassAPI = baseURL + '/infxClass';
jQuery.getJSON(infxClassAPI)
        .done(function (data) {
            // Should have the full list now
            console.log(data);
        });
// define filters
$('#builder').queryBuilder({
    onValidationError: function ($target, err) {
        console.error(err, $target);
    },
    plugins: {
        'bt-tooltip-errors': {delay: 100},
        'sortable': null,
        'filter-description': {mode: 'bootbox'}
    },
    filters: [
        /*
         * basic
         */
        {
            id: 'infxClass',
            label: 'Infection Classification',
            type: 'string',
            operators: 'equal',
            plugin: 'selectize',
            plugin_config: {
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                sortField: 'name',
                create: true,
                maxItems: 1,
                plugins: ['remove_button'],
                onInitialize: function () {
                    var that = this;
                    console.log('initialize infection class');
                    if (localStorage.infxClass === undefined) {
                        console.log('Do get infxClass');
                        $.getJSON(infxClassAPI, function (data) {
                            localStorage.infxClass = JSON.stringify(data);
                            data.forEach(function (item) {
                                that.addOption(item);
                            });
                        });
                    }
                    else {
                        console.log('Use local storage');
                        JSON.parse(localStorage.infxClass).forEach(function (item) {
                            that.addOption(item);
                        });
                    }
                }
            },
            onAfterCreateRuleInput: function ($rule) {
                $rule.find('.rule-value-container').css('min-width', '200px');
            },
            onAfterSetValue: function ($rule, value) {
                $rule.find('.rule-value-container input')[0].selectize.setValue(value);
            }
        },
        {
            id: 'SSI_EventTypes',
            label: 'SSI Event Types',
            type: 'string',
            operators: 'equal',
            plugin: 'selectize',
            plugin_config: {
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                sortField: 'name',
                create: true,
                maxItems: 1,
                plugins: ['remove_button'],
                onInitialize: function () {
                    var that = this;
                    console.log('initialize SSI Event Types');
                    if (localStorage.infxClass === undefined) {
                        console.log('Do get event types for SSI');
                        $.getJSON(infxClassAPI, function (data) {
                            localStorage.infxClass = JSON.stringify(data);
                            data.forEach(function (item) {
                                that.addOption(item);
                            });
                        });
                    }
                    else {
                        console.log('Use local storage');
                        JSON.parse(localStorage.infxClass).forEach(function (item) {
                            that.addOption(item);
                        });
                    }
                }
            },
            onAfterCreateRuleInput: function ($rule) {
                $rule.find('.rule-value-container').css('min-width', '200px');
            },
            onAfterSetValue: function ($rule, value) {
                $rule.find('.rule-value-container input')[0].selectize.setValue(value);
            }
        }
    ]
}
);
/** Some Rules **/
var rules =
        {
            "condition": "AND",
            "rules": [
                {
                    "id": "infxClass",
                    "field": "infxClass",
                    "type": "string",
                    "input": "text",
                    "operator": "equal",
                    "value": "SSI"
                },
                {"condition": "AND",
                    "rules": [
                        {
                            "id": "eventType",
                            "field": "eventType",
                            "type": "string",
                            "input": "text",
                            "operator": "equal",
                            "value": "SIP"
                        },
                        {
                            "id": "eventType",
                            "field": "eventType",
                            "type": "string",
                            "input": "text",
                            "operator": "equal",
                            "value": "SIS"
                        }
                    ]
                }
            ]
        };
jQuery('.parse-json').trigger('click');
// get rules
jQuery('.parse-json').on('click', function () {
    jQuery('#result').removeClass('hide')
            .find('pre').html(JSON.stringify(
            jQuery('#builder').queryBuilder('getRules'),
            undefined, 2
            ));
});
// set rules
$('.set').on('click',
        /**
         * Action for set rules ...
         * 
         * @returns {undefined}
         */
                function () {
                    $('#builder').queryBuilder('setRules', rules);
                    $('.parse-json').trigger('click');
                });