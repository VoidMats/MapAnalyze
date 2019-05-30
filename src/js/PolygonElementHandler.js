import ElementHandler from './ElementHandler.js';
import RandomGenerator from './RandomGenerator.js';

class PolygonElementHandler extends ElementHandler {

  /* This class creates the following bootstrap Collapsible List Group,
    with correct list element. The group starts with polygonOlClassHandler(className, client, color)

    <div class="panel-group">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" href="#collapse1">Collapsible list group</a>
          </h4>
        </div>
        <div id="collapse1" class="panel-collapse collapse">
          <ul class="list-group">
            <li class="list-group-item">One</li>
            <li class="list-group-item">Two</li>
            <li class="list-group-item">Three</li>
          </ul>
          <div class="panel-footer">Footer</div>
        </div>
      </div>
    </div>
  */

  static createPolygonListElement(name, id, client) {
    const outerdiv = this.createLiOuterDiv(id, client);
    const innerdiv = this.createLiInnerDiv(id);
    const modifybutton = this.createLiModifyButton(id, client);
    const deletebutton = this.createLiRemoveButton(id, client);

    super.appendElement(outerdiv, innerdiv);
    super.appendElement(outerdiv, modifybutton);
    super.appendElement(outerdiv, deletebutton);
    super.appendElement(super.getElementFromId(name + "collapse"), outerdiv);
    this.colorChanged(ElementHandler.getElementValFromId("cp"+name), name, client);
  }

  /* Create Outer Div for li */
  static createLiOuterDiv(id, client) {
    const outerdiv = super.createElement("div");
    super.addClassToElement(outerdiv, "list-group-item polygonLi");
    super.addAttrToElement(outerdiv, "data-id", id);
    super.setElementHover(outerdiv,
      this.polygonLiHoverHandler(client, true),
      this.polygonLiHoverHandler(client, false)
    );
    return outerdiv;
  }

  /* Create Inner Div for Li */
  static createLiInnerDiv(name) {
    const innerdiv = super.createElement("div");
    super.addClassToElement(innerdiv, "layerText");
    super.setElementHTML(innerdiv, name);
    super.addAttrToElement(innerdiv, "data-id", name);
    return innerdiv;
  }

  /* Create edit button */
  static createLiModifyButton(id, client) {
    const button = super.createElement("button");
    super.addAttrToElement(button, "data-id", id);
    super.addClassToElement(button, "polygonRemoveButton btn btn-warning");
    const icon = this.createIcon("edit", id);
    super.appendElement(button, icon);
    super.setElementClickHandler(button, (event) => {
      const id = event.target.getAttribute('data-id');
      let polygon = client.polygonCollection.getPolygon(id);
      client.sideBar.sidebarPolygonsTab.polygonModal.show(polygon);
      //new PolygonModal(client).show(polygon);
    });

    return button;
  }

  /* Create delete button */
  static createLiRemoveButton(id, client) {
    const button = super.createElement("button");
    super.addAttrToElement(button, "data-id", id);
    super.addClassToElement(button, "polygonRemoveButton btn btn-danger");
    const icon = super.createIcon("trash-alt", id);
    super.appendElement(button, icon);
    super.setElementClickHandler(button, (event) => {
      const id = event.target.getAttribute('data-id');
      ElementHandler.removeElementByAttr("data-id", id);
      client.polygonCollection.removePolygon(id);
    });

    return button;
  }

  /* Add hover handler for li on polygon */
  static polygonLiHoverHandler(client, hov) {
    return (event) => {
      let polygonCollection = client.polygonCollection;
      const id = event.target.getAttribute('data-id');
      const className = polygonCollection.getClassFromId(id);
      polygonCollection.changePolygonStyle(id, hov ?
        polygonCollection.polygonHoverStyle : polygonCollection.styles[className]);
      };
    }

    /* Add hover handler for polygon */
    static polygonClassHoverHandler(client, hov) {
      return (event) => {
        let polygonCollection = client.polygonCollection;
        const className = event.target.text;
        let idList = polygonCollection.getIdsFromClass(className);
        idList.forEach((id) => {
          polygonCollection.changePolygonStyle(id, hov ?
            polygonCollection.polygonHoverStyle : polygonCollection.styles[className]);
          })
        };
      }

      /* THIS IS THE START of Collapsible List Group */
      static polygonOlClassHandler(className, client, color) {
        const classDiv = this.createClassDiv(client, className, color);
        super.appendElement(super.getElementFromId("polygonsListDiv"), classDiv);
      }

      static createClassDiv(client, className, color) {
        const classDiv = super.createElement("div");
        super.addClassToElement(classDiv, "panel-group");
        const cp = this.createColorPicker(client, className, color);
        super.appendElement(classDiv, cp);
        const divOuterElement = this.createOlOuterElement(client, className);
        super.appendElement(classDiv, divOuterElement);
        ElementHandler.addAttrToElement(classDiv, "id", className);
        return classDiv;
      }

      /* Create colorpicker */
      static createColorPicker(client, className, color) {
        const cp = super.createElement("input");
        super.addAttrToElement(cp, "type", "color");
        super.addAttrToElement(cp, "style", "float:right");
        super.addAttrToElement(cp, "id", "cp" + className);
        if (color) {
          super.setElementVal(cp, color);
        } else {
          super.setElementVal(cp, RandomGenerator.getRandomColor());
        }
        cp.change((colorPicker) => {
          this.colorChanged(colorPicker.target.value, className, client);
        });
        return cp;
      }

      static createOlOuterElement(client, className) {
        const divOuterElement = super.createElement("div");
        super.addClassToElement(divOuterElement, "panel panel-default");
        const divHeadingElement = this.createOlDivHeadingElement(client, className);
        const divInnerElement = this.createOlInnerElement(client, className);
        super.appendElement(divOuterElement, divHeadingElement);
        super.appendElement(divOuterElement, divInnerElement);
        return divOuterElement;
      }

      /* Create title header */
      static createOlDivHeadingElement(client, className) {
        const divHeadingElement = super.createElement("div");
        super.addClassToElement(divHeadingElement, "panel-heading");
        const divTitleElement = this.createOlDivTitleElement(client, className);
        super.appendElement(divHeadingElement, divTitleElement);
        return divHeadingElement;
      }

      static createOlDivTitleElement(client, className) {
        const divTitleElement = super.createElement("h4");
        super.addClassToElement(divTitleElement, "panel-title");
        const aDivElement = this.createOlADivElement(client, className);
        super.appendElement(divTitleElement, aDivElement);
        return divTitleElement;
      }

      static createOlADivElement(client, className) {
        const aDivElement = super.createElement("a");
        super.addAttrToElement(aDivElement, "data-toggle", "collapse");
        super.addAttrToElement(aDivElement, "href", "#" + className + "collapse");
        super.addClassToElement(aDivElement, "collapseGroup");
        super.setElementText(aDivElement, className);
        super.setElementHover(aDivElement,
          this.polygonClassHoverHandler(client, true),
          this.polygonClassHoverHandler(client, false)
        );
        return aDivElement;
      }

      static createOlInnerElement(client, className) {
        const divInnerElement = super.createElement("div");
        super.addClassToElement(divInnerElement, "panel-collapse collapse in polygonListElement");
        super.addAttrToElement(divInnerElement, "id", className + "collapse");
        const olElement = this.createOl(className);
        super.appendElement(divInnerElement, olElement);
        return divInnerElement;
      }

      static createOl(className) {
        const olElement = super.createElement("ul");
        super.addAttrToElement(olElement, "id", className);
        super.addClassToElement(olElement, "list-group");
        return olElement;
      }

      static colorChanged(color, className, client) {
        client.polygonCollection.getPolygons().forEach((pol) => {
          if (pol.values_.name == className) {
            pol.setStyle(client.polygonCollection.createStyle(color, className));
            pol.setProperties({
              'color': color
            });
          }
        });
      }
    }
    export default PolygonElementHandler;
