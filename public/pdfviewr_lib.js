class PDFViewer {
  constructor(name) {
    self = this;
    self.Settings.name = name;
  }

  COLOR_H = "RGBA(255,255,0, 0.5)";
  COLOR_E = "RGBA(255,0,0, 0.5)";

  Settings = {
    isLog: false,
    name: "",

    pdfDoc: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.0,

    canvas: null,
    hl_parent: null,

    passage_text: "",
    passage_first_word_1: "",
    passage_first_word_2: "",
    passage_last_word_1: "",
    passage_last_word_2: "",
    em_lists: [],
  }

  LOG(...args) {
    if (self.Settings.isLog) console.log(...args);
  }

  checkContainInEmphasisList(txt) {
    let ret = false;

    if (txt.length < 1) return; // avoid empty word.

    let contains = self.Settings.em_lists.some(item => txt.includes(item));
    if (contains) {
      ret = true;
    }
    return ret;
  }

  // Highlight Rendering
  renderHighlights(item, viewport) {
    let highlightColor = self.checkContainInEmphasisList(item['str']) ? self.COLOR_E : self.COLOR_H;
    var item_left = item['transform'][4];
    var item_top = item['transform'][5];

    var rect = [item_left, item_top,
      item_left + item['width'], item_top + item['height']
    ];

    var view_rect = viewport.convertToViewportRectangle(rect);
    var abs_width = Math.abs(view_rect[0] - view_rect[2]);
    var abs_height = Math.abs(view_rect[1] - view_rect[3]) + 2;
    var abs_left = self.Settings.canvas.getBoundingClientRect().left + Math.min(view_rect[0], view_rect[2]);
    var abs_top = self.Settings.canvas.getBoundingClientRect().top + Math.min(view_rect[1], view_rect[3]);

    var style = 'position: absolute;' +
      ' opacity: 0.50;' +
      ' background-color:' + highlightColor + ';' +
      ' left:' + String(abs_left) + 'px;' +
      ' top:' + String(abs_top) + 'px;' +
      ' width:' + String(abs_width) + 'px;' +
      ' height: ' + String(abs_height) + 'px;';


    var e = document.createElement('div');
    e.setAttribute('style', style);
    self.Settings.hl_parent.appendChild(e);

    self.LOG("%c %s", `color:black; background-color:${highlightColor}; padding:2px 4px;`, item.str)
  }

  highlightTexts(page) {
    self.LOG("[highlightTexts]");

    // clear all highlight tags.
    while (self.Settings.hl_parent.firstChild) {
      self.Settings.hl_parent.removeChild(self.Settings.hl_parent.firstChild);
    }

    page.getTextContent().then(function (textContent) {
      self.LOG("[highlightTexts] getTextContent");
      var viewport = page.getViewport({
        'scale': self.Settings.scale
      });

      let texts = textContent.items;
      // search first_word position
      let fw_idx = texts.findIndex((itm, i) => {
        if (texts[i].str === self.Settings.passage_first_word_1) {
          let n = 1;
          while (texts[i + n].str === " ") {
            n++;
          }
          if (texts[i + n].str === self.Settings.passage_first_word_2) return true;
        }
      });

      // search last_word position
      let lw_idx = texts.findLastIndex((itm, i) => {
        if (texts[i].str === self.Settings.passage_last_word_1) {
          let p = 1;
          while (texts[i - p].str === " ") {
            p--;
          }
          if (texts[i - p].str === self.Settings.passage_last_word_2) return true;
        }
      });
      self.LOG("First Word index:", fw_idx, ", Last Word index:", lw_idx);
      if (!(fw_idx > 0 && lw_idx > 0)) return;

      // search by range
      for (let idx = fw_idx; idx <= lw_idx; idx++) {
        let item = texts[idx];
        self.renderHighlights(item, viewport);
      }
    });
  }

  // Page Rendering
  renderPage(num) {
    self.LOG("[renderPage]", num);
    self.Settings.pageRendering = true;

    // Using promise to fetch the page
    self.Settings.pdfDoc.getPage(num).then(function (page) {
      self.LOG("[renderPage] getPage");
      var viewport = page.getViewport({
        scale: self.Settings.scale
      });
      const outputScale = window.devicePixelRatio || 1;
      self.Settings.canvas.width = Math.floor(viewport.width * outputScale);
      self.Settings.canvas.height = Math.floor(viewport.height * outputScale);
      self.Settings.canvas.style.width = Math.floor(viewport.width) + "px";
      self.Settings.canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      // Render PDF page into canvas context
      var renderContext = {
        // canvasContext: self.Settings.ctx,
        canvasContext: self.Settings.canvas.getContext('2d'),
        viewport: viewport,
        transform: transform
      };

      var renderTask = page.render(renderContext);
      // Wait for rendering to finish
      renderTask.promise.then(function () {
        self.LOG("[renderPage] getPage render");
        // highlight
        self.highlightTexts(page);

        self.Settings.pageRendering = false;
        if (self.Settings.pageNumPending !== null) {
          // New page rendering is pending
          self.renderPage(self.Settings.pageNumPending);
          self.Settings.pageNumPending = null;
        }
      });
    });
  }

  queueRenderPage(num) {
    if (self.Settings.pageRendering) {
      self.Settings.pageNumPending = num;
    } else {
      self.Settings.pageNum = num;
      self.renderPage(num);
    }
  }

  async setPDFdatas(pdf_filepath, pagenum, passage_text) {
    self.LOG("[PDFViewrLib] setdatas");
    if (!pdf_filepath || !pagenum || !passage_text) return false;

    // get first and last words
    let passage_splits = passage_text.split(" "); // split by "SP"
    self.Settings.passage_first_word_1 = passage_splits[0];
    self.Settings.passage_first_word_2 = passage_splits[1];
    self.Settings.passage_last_word_1 = passage_splits[passage_splits.length - 1];
    self.Settings.passage_last_word_2 = passage_splits[passage_splits.length - 2];

    // get emphasis word　list
    let em_lists = passage_text.match(/<em>(.*?)<\/em>/g).map(item => item.replace(/<\/?em>/g, ""));
    self.Settings.em_lists = [...new Set(em_lists)]; // remove duplicates

    // remove emphasis tags
    self.Settings.passage_text = passage_text.replace(/<\/?em>/g, "");

    let ret = await pdfjsLib.getDocument(pdf_filepath).promise.then(function (pdfDoc_) {
      self.LOG("[getDocument] done");
      self.Settings.pdfDoc = pdfDoc_;
      self.renderPage(pagenum);

      return ({ "max": pdfDoc_.numPages });
    });
    return ret;
  }

  init(canvas_tag, highlight_tag) {
    self.LOG("[PDFViewrLib] init");
    if (!canvas_tag || !highlight_tag) return false;

    self.Settings.canvas = canvas_tag;
    self.Settings.hl_parent = highlight_tag;
    return true;
  }
}
export default PDFViewer;