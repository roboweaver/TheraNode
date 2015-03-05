
/* global Selectize */

Selectize.define('component', function () {
    var self = this;

    this.on('initialize', function () {
        self.open();
    });

    this.close = (function () {
        return function () {
        };
    })();
});

$('.dropdown').each(function () {
    $_self = $(this);
    $_self.find('select')
            .selectize({plugins: ['component'], maxItems: 1})
            .on('change', function () {
                console.log('Changed value to:', $(this).val());
                $_self.find('span.value').text($(this).val());
                if ($(this).val()) {
                    $_self.removeClass('open');
                }
            });
    $_self.find('.selectize-control').on('click', function (e) {
        e.stopPropagation();
    });
});

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