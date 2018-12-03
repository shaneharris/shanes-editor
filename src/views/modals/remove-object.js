export class RemoveObjectModal{
    constructor(context) {
        this.context = context;
    }
    open() {
        this.context.content.loadTemplates(['confirm-message'])
            .then(()=>this.context.content.compileTemplates('confirm-message',[{
                title:'Remove Object',
                message:'Are you sure you want to remove this object from the scene?',
                leftButtonText:'CANCEL',
                leftButtonFontColor:'#fff',
                leftButtonColor:'#009688',
                leftButtonRippleColor:'#fff',
                rightButtonText:'REMOVE OBJECT',
                rightButtonFontColor:'#fff',
                rightButtonColor:'#e57373',
                rightButtonRippleColor:'#fff'
            }],true))
            .then(contents=>this.context.content.popup.setContent(contents[0]))
            .then(()=>{
                let popupEl = document.querySelector('#removeObject').querySelector('.singleButton');
                document.querySelector('.right-button').addEventListener('mousedown',()=>{
                    popupEl.close();
                    let parent = this.context.currentObject.parent;
                    this.context.sceneGraph.removeObject();
                    this.context.currentObject.settings.state.removed = true;
                    this.context.sceneGraph.sync();
                    setTimeout(()=>this.context.itemView.open(parent),350);
                });
                document.querySelector('.left-button').addEventListener('mousedown',()=>{
                    popupEl.close();
                });
            });
    }
}