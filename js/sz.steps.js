(function(global, $){
	"use strict";
	
	$.prototype.initSteps = function (options) {
        return new Steps($(this), options);
    };
	
	function Steps(jqobj, options) {
        var thisobj = this;
        this.jqobj = jqobj;
        this.options = $.extend({}, thisobj._defaultOptions, options);
        this.globalDatas = {
            current: options.current || 0
        };
        if (this._isValid()) {
            this.init();
            this.fresh();
        } else {
            console.error("分步组件传参错误");
        }
    }

    Steps.prototype._defaultOptions = {
        direction: "vertical",        //horizontal  分步组件的方向
        connectorSize: "normal",    //long short
        processDescription: "进行中",
        waitDescription: "待进行",
        finishDescription: "已完成",
        errorDescription: "有错误",
        stepDetailDescription: [],    //每一步的描述信息
        maxstep: 5,                     //最多几步
        minstep: 2,                     //最少几步
        current: 0,
        stepcount: 0                    //步骤数总计
    };

    Steps.prototype._isValid = function () {
        var max = this.options.maxstep;
        var min = this.options.minstep;
        var stepcount = this._getStepCount();
        return stepcount <= max && stepcount >= min;
    };

    Steps.prototype._getStepCount = function () {
        var stepcount = this.options.stepcount;
        if (isNaN(stepcount) || stepcount <= 0) {
            stepcount = this.options.stepDetailDescription.length || 0;
        }
        return stepcount;
    };

    /**
     * 初始化
     */
    Steps.prototype.init = function () {
        var direction = this.options.direction;
        var connectorSize = this.options.connectorSize;
        if (!direction || (direction !== "vertical" && direction !== "horizontal")) {
            direction = "horizontal"
        }
        if (!connectorSize || (connectorSize !== "normal" && connectorSize !== "long" && connectorSize !== "short")) {
            connectorSize = "normal"
        }

        var directionClass = "sz-steps-" + direction;
        var connectorClass = "sz-steps-length-" + connectorSize;
        this.jqobj.html("<div class='sz-steps " + directionClass + " " + connectorClass + "'></div>");

        var item_html = "";
        var count = this._getStepCount();
        var descriptions = this.options.stepDetailDescription || [];
        var description;
        var statusClass;
        var statusDescription;
        for (var i = 0; i < count; i++) {
            //默认第一步是进行中 其他是待进行
            statusClass = i === 0 ? "sz-steps-status-process" : "sz-steps-status-wait";
            statusDescription = i === 0 ? this.options.processDescription : this.options.waitDescription;
            description = descriptions[i] ? descriptions[i] : "";
            item_html += '<div class="sz-steps-item ' + statusClass + '">' +
                '<div class="sz-steps-tail">' +
                '<i></i>' +
                '</div>' +
                '<div class="sz-steps-head">' +
                '<div class="sz-steps-head-inner">' +
                '<span>' + (i + 1) + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="sz-steps-main">' +
                '<div class="sz-steps-title">' + statusDescription + '</div>' +
                '<div class="sz-steps-content">' + description + '</div>' +
                '</div>' +
                '</div>';
        }
        this.jqobj.find(".sz-steps").html(item_html);
    };

    /**
     * 刷新
     */
    Steps.prototype.fresh = function () {
        var current = this.globalDatas.current;
        var count = this._getStepCount();
        var classz = "sz-steps-status-process sz-steps-status-wait sz-steps-status-finish sz-steps-status-error";
        for (var i = 0; i < current; i++) {
            this.jqobj.find(".sz-steps-item").eq(i).removeClass(classz).addClass("sz-steps-status-finish");
            this.jqobj.find(".sz-steps-item").eq(i).find(".sz-steps-title").html(this.options.finishDescription);
        }
        this.jqobj.find(".sz-steps-item").eq(current).removeClass(classz).addClass("sz-steps-status-process");
        this.jqobj.find(".sz-steps-item").eq(current).find(".sz-steps-title").html(this.options.processDescription);
        for (var i = current + 1; i < count; i++) {
            this.jqobj.find(".sz-steps-item").eq(i).removeClass(classz).addClass("sz-steps-status-wait");
            this.jqobj.find(".sz-steps-item").eq(i).find(".sz-steps-title").html(this.options.waitDescription);
        }
    };

    /**
     * 下一步
     */
    Steps.prototype.next = function () {
        var count = this._getStepCount();
        if (this.globalDatas.current < count) {
            this.globalDatas.current += 1;
            this.fresh();
        } else {
            console.error("next步数超限");
        }
    };

    /**
     * 上一步
     */
    Steps.prototype.pre = function () {
        if (this.globalDatas.current > 0) {
            this.globalDatas.current -= 1;
            this.fresh();
        } else {
            console.error("pre步数超限");
        }
    };

    /**
     * 跳到step 步骤  step为下标索引  从0开始
     * @param step
     */
    Steps.prototype.jump = function (step) {
        var count = this._getStepCount();
        if (!isNaN(step) && step >= 0 && step < count) {
            this.globalDatas.current = step;
            this.fresh();
        } else {
            console.error("jump步数超限");
        }
    };

    /**
     * 当前步骤提示出错
     */
    Steps.prototype.makeError = function () {
        var current = this.globalDatas.current;
        var stepItemObj = this.jqobj.find(".sz-steps-item").eq(current);
        if (stepItemObj) {
            stepItemObj.addClass("sz-steps-status-error");
            if (window.sz_steps_errorTimeout) {
                clearTimeout(window.sz_steps_errorTimeout);
            }
            window.sz_steps_errorTimeout = setTimeout(function () {
                stepItemObj.removeClass("sz-steps-status-error");
            }, 2000);
        }
    };

    /**
     * 获取当前步骤的小标索引
     */
    Steps.prototype.getCurrentStep = function () {
        return this.globalDatas.current;
    };
	
	!('Steps' in global) && (global.Steps = Steps);
	
})(window, $);