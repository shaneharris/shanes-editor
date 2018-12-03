/* global AFRAME,TWEEN,THREE */
/**
 * The display container for the currently open object.
 * @namespace expanse-editor
 * @component display-box
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('display-box', {
    schema:{
        gizmoEl:{type:'selector'}
    },
    init(){
        this.setupElements();
    },
    setupElements(){
        // Create box with back side texture barely opaque to show the currently selected object.
        this.display_box = document.createElement('a-box');
        this.display_box.setAttribute('src','https://cdn.theexpanse.app/images/display_texture.png');
        this.display_box.setAttribute('side','back');
        this.display_box.setAttribute('transparent',true);
        this.display_box.setAttribute('shader','flat');
        this.display_box.setAttribute('opacity',0.1);
        this.el.appendChild(this.display_box);
        // Create an empty entity to contain the corners. As we scale the box the corners should stay the same size
        // so they are positioned outside the display box.
        this.cornerContainer = document.createElement('a-entity');
        this.el.appendChild(this.cornerContainer);
        // Setup all corners of the box.
        this.corner_ftl = this.createCorner('FTL');
        this.corner_ftr = this.createCorner('FTR');
        this.corner_fbl = this.createCorner('FBL');
        this.corner_fbr = this.createCorner('FBR');
        this.corner_btl = this.createCorner('BTL');
        this.corner_btr = this.createCorner('BTR');
        this.corner_bbl = this.createCorner('BBL');
        this.corner_bbr = this.createCorner('BBR');
    },
    hide(){
        // Set an empty object to hide.
        this.setObject();
    },
    setObject(object){
        if(!object){
            if(this.data.gizmoEl.components['gizmo']){
                this.data.gizmoEl.components['gizmo'].setObject()
            }
            this.el.sceneEl.context.viewUtils.hideTransformOptions();
            return new TWEEN.Tween(this.display_box.getAttribute('scale'))
                .to(new THREE.Vector3(0.00001,0.00001,0.00001), 250)
                .onComplete(()=>{
                    new TWEEN.Tween(this.el.getAttribute('scale'))
                        .to(new THREE.Vector3(0.00001,0.00001,0.00001), 250)
                        .easing(TWEEN.Easing.Exponential.Out).start();
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
        }
        // Get box fromt he selected object.
        this.boundingBox = new THREE.Box3().setFromObject(object);
        this.boundingBoxSize = this.boundingBox.getSize();
        // Animate the display box to the new object position and scale.
        new TWEEN.Tween(this.el.getAttribute('scale'))
            .to(new THREE.Vector3(1,1,1), 250)
            .easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.display_box.getAttribute('scale'))
            .to(new THREE.Vector3(this.boundingBoxSize.x+0.1,this.boundingBoxSize.y+0.1,this.boundingBoxSize.z+0.1), 250)
            .easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.display_box.getAttribute('position'))
            .to(this.boundingBox.getCenter(), 250)
            .easing(TWEEN.Easing.Exponential.Out).start();
        // Animate the corner container scale
        this.cornerContainer.setAttribute('scale','0.000001 0.000001 0.000001');
        new TWEEN.Tween(this.cornerContainer.getAttribute('scale'))
            .to(new THREE.Vector3(1,1,1), 250)
            .easing(TWEEN.Easing.Exponential.Out).start();
        // Move the corners to the new positions.
        this.setCornerPositions();
        // Trigger the object on the gizmos also
        // TODO: Move this out of this component
        if(this.data.gizmoEl.components['gizmo']){
            this.data.gizmoEl.components['gizmo'].setObject(object,this.boundingBox)
        }
    },
    setCornerPositions(){
        // Set all the corner positions from the min/max of the Box3
        let min = this.boundingBox.min;
        let max = this.boundingBox.max;
        this.corner_ftl.setAttribute('position',{x:min.x,y:max.y,z:min.z});
        this.corner_ftr.setAttribute('position',{x:max.x,y:max.y,z:min.z});
        this.corner_fbl.setAttribute('position',{x:min.x,y:min.y,z:min.z});
        this.corner_fbr.setAttribute('position',{x:max.x,y:min.y,z:min.z});

        this.corner_btl.setAttribute('position',{x:min.x,y:max.y,z:max.z});
        this.corner_btr.setAttribute('position',{x:max.x,y:max.y,z:max.z});
        this.corner_bbl.setAttribute('position',{x:min.x,y:min.y,z:max.z});
        this.corner_bbr.setAttribute('position',{x:max.x,y:min.y,z:max.z});
    },
    createCorner(corner){
        // Create three boxes for the corner indicators.
        let box_1 = document.createElement('a-box');
        let box_2 = document.createElement('a-box');
        let box_3 = document.createElement('a-box');
        box_1.setAttribute('scale','0.16 0.009 0.009');
        box_2.setAttribute('scale','0.01 0.16 0.01');
        box_3.setAttribute('scale','0.009 0.009 0.16');
        // Position all three boxes to the correct corner within the corner container.
        let extraScale = 0.055;
        let longScale = 0.075;
        switch(corner){
            case "FTL":
                box_1.setAttribute('position',(longScale-extraScale)+' '+extraScale+' -'+extraScale);
                box_2.setAttribute('position','-'+extraScale+' '+(-longScale+extraScale)+' -'+extraScale);
                box_3.setAttribute('position','-'+extraScale+' '+extraScale+' '+(longScale-extraScale));
                break;
            case "FTR":
                box_1.setAttribute('position',(-longScale+extraScale)+' '+extraScale+' -'+extraScale);
                box_2.setAttribute('position',extraScale+' '+(-longScale+extraScale)+' -'+extraScale);
                box_3.setAttribute('position',extraScale+' '+extraScale+' '+(longScale-extraScale));
                break;
            case "FBL":
                box_1.setAttribute('position',(longScale-extraScale)+' -'+extraScale+' -'+extraScale);
                box_2.setAttribute('position','-'+extraScale+' '+(longScale-extraScale)+' -'+extraScale);
                box_3.setAttribute('position','-'+extraScale+' -'+extraScale+' '+(longScale-extraScale));
                break;
            case "FBR":
                box_1.setAttribute('position',(-longScale+extraScale)+' -'+extraScale+' -'+extraScale);
                box_2.setAttribute('position',extraScale+' '+(longScale-extraScale)+' -'+extraScale);
                box_3.setAttribute('position',extraScale+' -'+extraScale+' '+(longScale-extraScale));
                break;

            case "BTL":
                box_1.setAttribute('position',(longScale-extraScale)+' '+extraScale+' '+extraScale);
                box_2.setAttribute('position','-'+extraScale+' '+(-longScale+extraScale)+' '+extraScale);
                box_3.setAttribute('position','-'+extraScale+' '+extraScale+' '+(-longScale+extraScale));
                break;
            case "BTR":
                box_1.setAttribute('position',(-longScale+extraScale)+' '+extraScale+' '+extraScale);
                box_2.setAttribute('position',extraScale+' '+(-longScale+extraScale)+' '+extraScale);
                box_3.setAttribute('position',extraScale+' '+extraScale+' '+(-longScale+extraScale));
                break;
            case "BBL":
                box_1.setAttribute('position',(longScale-extraScale)+' -'+extraScale+' '+extraScale);
                box_2.setAttribute('position','-'+extraScale+' '+(longScale-extraScale)+' '+extraScale);
                box_3.setAttribute('position','-'+extraScale+' -'+extraScale+' '+(-longScale+extraScale));
                break;
            case "BBR":
                box_1.setAttribute('position',(-longScale+extraScale)+' -'+extraScale+' '+extraScale);
                box_2.setAttribute('position',extraScale+' '+(longScale-extraScale)+' '+extraScale);
                box_3.setAttribute('position',extraScale+' -'+extraScale+' '+(-longScale+extraScale));
                break;
        }
        // Contain this corner inside an entity to be able to move it as one piece.
        let cornerIndicator = document.createElement('a-entity');
        cornerIndicator.appendChild(box_1);
        cornerIndicator.appendChild(box_2);
        cornerIndicator.appendChild(box_3);
        // Add to container
        this.cornerContainer.appendChild(cornerIndicator);
        return cornerIndicator;
    }
});