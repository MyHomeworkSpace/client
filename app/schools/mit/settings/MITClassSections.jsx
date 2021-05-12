import "schools/mit/settings/MITClassSections.styl";

import { h, Component } from "preact";

export default class MITClassSections extends Component {
	setSection(subjectID, sectionCode) {
		this.props.setSectionForSubject(subjectID, sectionCode);
	}

	render(props, state) {
		let sectionGroups = {};

		props.registeredClass.sections.forEach(function(section) {
			let sectionType = section.sectionCode[0];

			if (section.time != "*TO BE ARRANGED") {
				if (!sectionGroups[sectionType]) {
					sectionGroups[sectionType] = [];
				}

				sectionGroups[sectionType].push(section);
			}
		});

		let sectionGroupCodes = [];
		if (sectionGroups["L"]) { sectionGroupCodes.push("L"); }
		if (sectionGroups["R"]) { sectionGroupCodes.push("R"); }
		if (sectionGroups["B"]) { sectionGroupCodes.push("B"); }
		if (sectionGroups["D"]) { sectionGroupCodes.push("D"); }

		let selectedSections = props.registeredClass.selectedSections;
		let selectedSectionsList = (selectedSections == "" ? [] : selectedSections.split(","));

		let hasCode = [];
		for (let codeIndex in sectionGroupCodes) {
			let code = sectionGroupCodes[codeIndex];

			let foundCode = false;
			for (let i = 0; i < selectedSectionsList.length; i++) {
				if (selectedSectionsList[i][0] == code) {
					foundCode = true;
					break;
				}
			}
			hasCode.push(foundCode);
		}

		return <div class="mitClassSections">
			<h4 class="mitClassSectionsName">{props.registeredClass.subjectID} {props.registeredClass.title}</h4>
			<div class="row">
				{sectionGroupCodes.map((sectionGroupCode, i) => {
					let codeToName = {
						"B": "Lab",
						"D": "Design",
						"L": "Lecture",
						"R": "Recitation"
					};
					let sectionsInGroup = sectionGroups[sectionGroupCode];

					return <div class="col-md-4 mitClassSectionGroup">
						<div class="mitClassSectionGroupTitle">{codeToName[sectionGroupCode]}</div>
						{[
							{ time: "None", sectionCode: sectionGroupCode + "NONE" }
						].concat(sectionsInGroup).map((sectionInGroup) => {
							return <div class="mitClassSection">
								<label>
									<input type="radio" checked={selectedSections.indexOf(sectionInGroup.sectionCode) > -1 || (sectionInGroup.sectionCode == sectionGroupCode + "NONE" && !hasCode[i])} onChange={this.setSection.bind(this, props.registeredClass.subjectID, sectionInGroup.sectionCode)} />
									<div class="mitClassSectionInfo">
										<div class="mitClassSectionTime">{sectionInGroup.time}</div>
										{sectionInGroup.place && <div class="mitClassSectionDetails">in {sectionInGroup.place}</div>}
										{sectionInGroup.facultyName && <div class="mitClassSectionDetails">{sectionInGroup.facultyName}</div>}
									</div>
								</label>
							</div>;
						})}
					</div>;
				})}
			</div>
		</div>;
	}
};