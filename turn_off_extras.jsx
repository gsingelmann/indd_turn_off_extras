/* ---------------------------------------------------------------------------------- *\ 
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
\* ---------------------------------------------------------------------------------- */ 
/* ---------------------------------------------------------------------------------- *\  
turn_off_extras
Description:Toggle most display preferences in one UI
[Ver. 1]  
[Author: Gerald Singelmann. ] 
[Lang: DE, EN, FR]  
[Tested with: InDesign CC]  
[Creat: 19-08-21]  
Bugs & Feedback : https://github.com/gsingelmann/indd_turn_off_extras
www.cuppascript.com  
\* ---------------------------------------------------------------------------------- */ 

if ( app.documents.length ) main();

function main() {
	// --------------------------------------------------------------------------------------------
	//	Localisation strings in _l are set in init()
	// --------------------------------------------------------------------------------------------
	var _l = {};
	init();
	var doc = app.activeDocument;

	// --------------------------------------------------------------------------------------------
	//	The preferences we set
	//	e.g. 'enableStylePreviewMode' is exactly the name of the property in InDesign
	// --------------------------------------------------------------------------------------------
	var prefs = {
		textPreferences: {
			enableStylePreviewMode: false,
			highlightCustomSpacing: false,
			highlightHjViolations: false,
			highlightKeeps: false,
			highlightKinsoku: false,
			highlightSubstitutedFonts: false,
			highlightSubstitutedGlyphs: false,
			showInvisibles: false,
		},
		gridPreferences: {
			baselineGridShown: false,
			documentGridShown: false,
		},
		guidePreferences: {
			guidesShown: false,
		},
		viewPreferences: {
			showFrameEdges: false,
			showNotes: false,
		},
		xmlViewPreferences: {
			showTaggedFrames: false,
			showTagMarkers: false,
		}
	}	
	// --------------------------------------------------------------------------------------------
	//	 labels HAS to have the same structure as prefs + section_names
	// --------------------------------------------------------------------------------------------
	var labels = {
		textPreferences: {
			section_name: localize( _l.textPreferences ),
			enableStylePreviewMode: localize( _l.enableStylePreviewMode ),
			highlightCustomSpacing: localize( _l.highlightCustomSpacing ),
			highlightHjViolations: localize( _l.highlightHjViolations ),
			highlightKeeps: localize( _l.highlightKeeps ),
			highlightKinsoku: localize( _l.highlightKinsoku ),
			highlightSubstitutedFonts: localize( _l.highlightSubstitutedFonts ),
			highlightSubstitutedGlyphs: localize( _l.highlightSubstitutedGlyphs ),
			showInvisibles: localize( _l.showInvisibles ),
		},
		gridPreferences: {
			section_name: localize( _l.gridPreferences ),
			baselineGridShown: localize( _l.baselineGridShown ),
			documentGridShown: localize( _l.documentGridShown ),
		},
		guidePreferences: {
			section_name: localize( _l.guidePreferences ),
			guidesShown: localize( _l.guidesShown ),
		},
		viewPreferences: {
			section_name: localize( _l.viewPreferences ),
			showFrameEdges: localize( _l.showFrameEdges ),
			showNotes: localize( _l.showNotes ),
		},
		xmlViewPreferences: {
			section_name: localize( _l.xmlViewPreferences ),
			showTaggedFrames: localize( _l.showTaggedFrames ),
			showTagMarkers: localize( _l.showTagMarkers ),
		}
	}	

	// --------------------------------------------------------------------------------------------
	//	Store the current settings in the prefs-Object
	// --------------------------------------------------------------------------------------------
	for ( var section in prefs ) {
		for ( var pref in prefs[section] ) {
			if ( doc.hasOwnProperty( section ) ) {
				if ( doc[section].hasOwnProperty( pref ) ) {
					prefs[section][pref] = doc[section][pref];
				}
			} 
		}
	}
	// --------------------------------------------------------------------------------------------
	//	Remember the current settings once per document
	// --------------------------------------------------------------------------------------------
	if ( doc.extractLabel("gs_prefs_resetter") == "" ) {
		doc.insertLabel( "gs_prefs_resetter", prefs.toSource() );
	}
	
	// --------------------------------------------------------------------------------------------
	// Ask the user
	// --------------------------------------------------------------------------------------------
	var w = new Window("dialog");
	w.orientation ="row";
	w.alignChildren = "top";
	w.main = w.add("group");
	w.main.orientation = "column";
	w.main.alignChildren = "fill";
	for ( var section in prefs ) {
		w.main[section] = w.main.add( "panel" );
		w.main[section].text = labels[section].section_name;
		w.main[section].alignChildren = "fill";
		for ( var pref in prefs[section] ) {
			var aux = w.main[section].add("group");
			aux.alignChildren = "bottom"
			w.main[section][pref] = aux.add('checkbox');
			w.main[section][pref].value = prefs[section][pref];
			aux.add("statictext", undefined, labels[section][pref] );
		}
	}
	w.btns = w.add("group");
	w.btns.orientation = "column";
	w.btns.alignChildren = "fill";
	w.defaultElement = w.btns.add("button", undefined, localize( _l.defaultElement ));
	w.btns.cancel = w.btns.add("button", undefined, localize( _l.cancel ));
	w.btns.ok = w.btns.add("button", undefined, localize( _l.ok ) );
	w.btns.restore = w.btns.add("button", undefined, localize( _l.restore ), {enabled: doc.extractLabel("gs_prefs_resetter") != ""} );
	w.btns.last_combo = w.btns.add("button", undefined, localize( _l.last_combo ), {enabled: app.extractLabel("gs_extras_last_settings") != ""} );
	
	w.btns.ok.onClick = function() {
		for ( var section in prefs ) {
			for ( var pref in prefs[section] ) {
				prefs[section][pref] = this.window.main[section][pref].value;
			}
		}
		w.close(1);
	}
	w.btns.cancel.onClick = function() {
		w.close(2);
	}
	w.defaultElement.onClick = function() {
		w.close(3);
	}
	w.defaultElement.notify = function() {
		w.close(3);
	}
	w.btns.restore.onClick = function() {
		w.close(4);		
	}
	w.btns.last_combo.onClick = function() {
		w.close(5);
	}
	
	
	var todo = w.show();
	// --------------------------------------------------------------------------------------------
	//	1 = "Apply"
	// --------------------------------------------------------------------------------------------
	if ( todo == 1 ) {
		app.insertLabel( "gs_extras_last_settings",  prefs.toSource() );
		for ( var section in prefs ) {
			for ( var pref in prefs[section] ) {
				doc[section][pref] = prefs[section][pref];
			}
		}
	
	// --------------------------------------------------------------------------------------------
	//	3 = "All off"
	// --------------------------------------------------------------------------------------------
} else if ( todo == 3 ) {
		for ( var section in prefs ) {
			for ( var pref in prefs[section] ) {
				doc[section][pref] = false;
			}
		}
		
	// --------------------------------------------------------------------------------------------
	//	4 = "Restore"
	// --------------------------------------------------------------------------------------------
} else if ( todo == 4 ) {
		var saved = doc.extractLabel( "gs_prefs_resetter" );
		if ( saved != "" ) {
			saved = eval( saved );
			for ( var section in saved ) {
				for ( var pref in saved[section] ) {
					doc[section][pref] = saved[section][pref];
				}			// for pref in section
			}				// for section in saved
		}					// if saved

	// --------------------------------------------------------------------------------------------
	//	5 = "Last Settings"
	// --------------------------------------------------------------------------------------------
} else if ( todo == 5 ) {
		var saved = app.extractLabel( "gs_extras_last_settings" );
		if ( saved != "" ) {
			saved = eval( saved );
			for ( var section in saved ) {
				for ( var pref in saved[section] ) {
					doc[section][pref] = saved[section][pref];
				}			// for pref in section
			}				// for section in saved
		}					// if saved
	}						// if todo == x


	function init() {
		
		_l = {
				textPreferences: { 
						de: 'Text Einstellungen',
						en: 'Text Preferences',
						fr: 'Paramètres de texte'
				},
				enableStylePreviewMode: { 
						de: 'Formatabweichungen anzeigen',
						en: 'Style Preview Mode',
						fr: 'Surligneur de remplacement de style'
				},
				highlightCustomSpacing: { 
						de: 'Spationierung anzeigen',
						en: 'Custom Spacing',
						fr: 'Approche/Crénage personalisés'
				},
				highlightHjViolations: { 
						de: 'Silbentrennung anzeigen',
						en: 'HJ Violations',
						fr: 'Infraction de césures et de justification'
				},
				highlightKeeps: { 
						de: 'Umbruchverletzung anzeigen',
						en: 'Keeps Violations',
						fr: 'Infraction d’enchainement'
				},
				highlightKinsoku: { 
						de: 'Kinsoku anzeigen',
						en: 'Kinsoku',
						fr: 'Composition Kinsoku'
				},
				highlightSubstitutedFonts: { 
						de: 'Ersetzte Schriften anzeigen',
						en: 'Substituted Fonts',
						fr: 'Polices substituées' 
				},
				highlightSubstitutedGlyphs: { 
						de: 'Ersetzte Glyphen anzeigen',
						en: 'Substituted Glyphs',
						fr: 'Glyphes remplacés'
				},
				showInvisibles: { 
						de: 'Verborgene Zeichen anzeigen',
						en: 'Show Invisibles',
						fr: 'Afficher les caractères masqués'
				},
				 
				 
				gridPreferences: { 
						de: 'Raster Einstellungen',
						en: 'Grid Preferences',
						fr: 'Paramètres de la grille'
				},
				baselineGridShown: { 
						de: 'Grundlinienraster anzeigen',
						en: 'Baseline Grid',
						fr: 'Afficher la grille de ligne de base'
				},
				documentGridShown: { 
						de: 'Dokumentraster azeigen',
						en: 'Document Grid',
						fr: 'Afficher la grille de document'
				},
				 
				 
				guidePreferences: { 
						de: 'Hilfslinien Einstellungen',
						en: 'Guides',
						fr: 'Paramètres des guides'
				},
				guidesShown: { 
						de: 'Hilfslinien anzeigen',
						en: 'Show Guides',
						fr: 'Afficher les guides'
				},
				 
				 
				viewPreferences: { 
						de: 'Fenster Einstellungen',
						en: 'View Preferences',
						fr: 'Paramètres d’affichage'
				},
				showFrameEdges: { 
						de: 'Rahmenkanten anzeigen',
						en: 'Show Frame Edges',
						fr: 'Afficher le contour des blocs'
				},
				showNotes: { 
						de: 'Notizen anzeigen',
						en: 'Show Notes',
						fr: 'Afficher les notes'
				},
				 
				 
				xmlViewPreferences: { 
						de: 'XML Einstellungen',
						en: 'XML Preferences',
						fr: 'Paramètres XML'
				},
				showTaggedFrames: { 
						de: 'Getaggte Rahmen anzeigen',
						en: 'Show Tagged Frames',
						fr: 'Afficher les blocs balisés'
				},
				showTagMarkers: { 
						de: 'Tagmarken anzeigen',
						en: 'Show Tag Markers',
						fr: 'Afficher les marques des balises'
				},
				 
				 
				defaultElement: { 
						de: 'Alle aus',
						en: 'Everything off',
						fr: 'Désactiver tout'
				},
				cancel: { 
						de: 'Abbrechen',
						en: 'Cancel',
						fr: 'Annuler'
				},
				ok: { 
						de: 'Anwenden',
						en: 'Apply',
						fr: 'Appliquer'
				},
				restore: { 
						de: 'org. Zustand',
						en: 'Initial Settings',
						fr: 'Restaurer les paramêtres'
				},
				last_combo: { 
						de: 'letzte Kombo',
						en: 'Last Combo',
						fr: 'Dernier Combo'
				}
		}   	
	}

}

