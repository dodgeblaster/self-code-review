import { unifiedMergeView, MergeView } from "./cm/@codemirror-merge.js";
import { EditorView, basicSetup } from "./cm/codemirror.js";
import { EditorState } from "./cm/@codemirror-state.js";
let count = 0

class MyChat extends HTMLElement {
  constructor() {
    super();

    this.count = count 

    count++
    
  }

  connectedCallback() {
    //

    this.innerHTML = /*html*/ `
        
        <div id='diff-view' style='display: flex; 
     
  
        background: white;
       
        padding: 0px;
        padding-left: 0px;
    flex-direction: column;
    

        '>
        <div style='flex 0 0 40px; position: relative;height: 30px; display: flex; align-items: center; padding: 0 12px; 
            background: #fbfbfb;
       border-bottom: 1px solid #e7e9ec; border-top: 1px solid #e7e9ec;'>
         <button id='diff-view-close' style='background: none; border: none; position: absolute; top: 8px; right: 8px;'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style='height: 12px; width: 12px;' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        <p style='font-family: Geist; margin: 0; font-size: 12px' id='diff-view-title-${this.count}'></p>
     
        </div>
       
        <div id='diff-view-content-${this.count}' style='flex: 1;  overflow-y: scroll;'></div>
        </div>
    `;

    const close = document.getElementById("diff-view-close");
    const closeAction = () => this.close();
    close.addEventListener("click", closeAction);

    
  }

  target = false;
  getAdditionalTopology = () => {
    store.getAdditionalTopology(this.target);
  };

  show = (file, original = 'nothing', updated) => {

    document.getElementById("diff-view-title-" + this.count).textContent = file;
    //this.target = compare;
    document.getElementById("diff-view-content-" + this.count).innerHTML = "";

    //const result = store.getCodeDiff(compare);

    const target = document.getElementById("diff-view-content-" + this.count );

    let view = new MergeView({
      a: {
        doc: original,
        extensions: basicSetup,
      },
      b: {
        doc: updated,
        extensions: [
          basicSetup,
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
        ],
      },
      
      parent: target,
    });

    // document.getElementById("diff-view-content").innerHTML = "open!";

    // set element to show
    //document.getElementById("diff-view").style.display = "flex";
   // document.getElementById("diff-view").style.transform = "translateY(0px)";
    //    transform: translate-y(400px);
  };

  close = () => {
    // clear innher html
    //document.getElementById("diff-view").style.display = "none";
    //document.getElementById("diff-view").style.transform = "translateY(400px)";

    // set element to hide
    // document.getElementById("diff-view-content").innerHTML = "";
  };
}

customElements.define("diff-view", MyChat);
