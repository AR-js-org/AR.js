AFRAME.registerComponent("clicker", {
    init: function() {
        this.el.addEventListener("click", e=> {
            const dist = this.el.components["gps-new-entity-place"].distance;
            alert(dist === undefined ? "Please move to a new location to obtain the distance" : `This object is ${dist} metres away.`);
        });
    }
});
