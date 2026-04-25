export type SignCategory = 'Regulatory' | 'Warning' | 'Guide' | 'Services' | 'Recreation';

export type ScenarioType = '4-way' | 'T-junction' | 'Straight' | 'Curve' | 'Crosswalk' | 'Merge';

export interface Sign {
  id: string;
  name: string;
  category: SignCategory;
  description: string;
  expectation: string;
  shape: 'Octagon' | 'Triangle' | 'Diamond' | 'Rectangle' | 'Circle' | 'Pennant' | 'Crossbuck';
  color: string;
  icon?: string;
  scenario: ScenarioType;
}

export const SIGNS: Sign[] = [
  { id: 'R1-1', name: 'Stop', category: 'Regulatory', description: 'Requires a complete stop at the stop line or before entering the crosswalk/intersection.', expectation: 'Come to a full stop. Yield the right-of-way to vehicles and pedestrians already in the intersection. Proceed only when safe.', shape: 'Octagon', color: '#CC0000', scenario: '4-way' },
  { id: 'R1-2', name: 'Yield', category: 'Regulatory', description: 'Indicates you must slow down and be ready to stop if necessary to let other traffic proceed.', expectation: 'Slow down. Yield to traffic in the intersection or on the connecting road. Stop if necessary to avoid a collision.', shape: 'Triangle', color: '#CC0000', scenario: 'T-junction' },
  { id: 'R2-1', name: 'Speed Limit 55', category: 'Regulatory', description: 'The maximum legal speed under ideal conditions.', expectation: 'Drive no faster than 55 MPH. Reduce speed for rain, snow, heavy traffic, or construction.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' },
  { id: 'R2-1_35', name: 'Speed Limit 35', category: 'Regulatory', description: 'Maximum legal speed, often used in residential or business districts.', expectation: 'Maintain speed at or below 35 MPH. Watch for pedestrians and driveway traffic.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' },
  { id: 'R3-1', name: 'No Right Turn', category: 'Regulatory', description: 'Prohibits drivers from making a right turn at this intersection.', expectation: 'Continue straight or turn left. Do not initiate a right turn maneuver.', shape: 'Rectangle', color: '#FFFFFF', scenario: '4-way' },
  { id: 'R3-2', name: 'No Left Turn', category: 'Regulatory', description: 'Prohibits drivers from making a left turn at this intersection.', expectation: 'Continue straight or turn right. Do not initiate a left turn maneuver.', shape: 'Rectangle', color: '#FFFFFF', scenario: '4-way' },
  { id: 'R3-4', name: 'No U-Turn', category: 'Regulatory', description: 'Prohibits making a 180-degree turn to go in the opposite direction.', expectation: 'Do not attempt to reverse direction at this location. Continue to the next safe turn.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' },
  { id: 'R4-7', name: 'Keep Right', category: 'Regulatory', description: 'Directs traffic to stay to the right of an obstruction or median.', expectation: 'Pass the sign/obstruction on the right side only.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' },
  { id: 'R5-1', name: 'Do Not Enter', category: 'Regulatory', description: 'Marks the exit-only side of a one-way road or ramp.', expectation: 'Immediately stop and turn around if you see this sign facing you. You are going the wrong way.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' },
  { id: 'R6-1', name: 'One Way', category: 'Regulatory', description: 'Indicates traffic flows only in the direction of the arrow.', expectation: 'Travel only in the specified direction. Watch for vehicles entering from side streets.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' },
  { id: 'W1-1', name: 'Turn Left', category: 'Warning', description: 'Warns of a sharp 90-degree turn to the left ahead.', expectation: 'Reduce speed significantly before entering the turn.', shape: 'Diamond', color: '#FFCC00', scenario: 'Curve' },
  { id: 'W1-2', name: 'Curve Right', category: 'Warning', description: 'Warns of a gradual curve to the right.', expectation: 'Adjust speed for the curve. Stay within lane markings.', shape: 'Diamond', color: '#FFCC00', scenario: 'Curve' },
  { id: 'W3-1', name: 'Stop Ahead', category: 'Warning', description: 'Warns that there is a stop sign hidden from view further down the road.', expectation: 'Begin braking early to ensure a smooth and complete stop at the intersection.', shape: 'Diamond', color: '#FFCC00', scenario: 'Straight' },
  { id: 'W3-3', name: 'Signal Ahead', category: 'Warning', description: 'Warns of a traffic light ahead.', expectation: 'Be prepared for the light to change. Watch for queues of stopped vehicles.', shape: 'Diamond', color: '#FFCC00', scenario: 'Straight' },
  { id: 'W4-1', name: 'Merge', category: 'Warning', description: 'Warns that two separate lanes of traffic will soon join into one.', expectation: 'Adjust speed and position to allow other vehicles to enter the traffic flow smoothly.', shape: 'Diamond', color: '#FFCC00', scenario: 'Merge' },
  { id: 'W11-2', name: 'Pedestrian Crossing', category: 'Warning', description: 'Warns of a designated crosswalk or high pedestrian activity area.', expectation: 'Slow down and scan the roadside. Yield to any pedestrians in the crosswalk.', shape: 'Diamond', color: '#FFCC00', scenario: 'Crosswalk' },
  { id: 'W11-3', name: 'Deer Crossing', category: 'Warning', description: 'Warns that deer often cross the road in this area.', expectation: 'Be alert, especially at dawn and dusk. Use high beams when appropriate and be ready to brake.', shape: 'Diamond', color: '#FFCC00', scenario: 'Straight' },
  { id: 'W14-1', name: 'Dead End', category: 'Warning', description: 'Warns that the road does not connect to any other road.', expectation: 'Do not enter unless your destination is on this road. Prepare to turn around.', shape: 'Diamond', color: '#FFCC00', scenario: 'Straight' },
  { id: 'W8-5', name: 'Slippery When Wet', category: 'Warning', description: 'Warns that the road surface becomes extra hazardous during rain or ice.', expectation: 'Increase following distance. Avoid sudden braking or sharp turns in wet conditions.', shape: 'Diamond', color: '#FFCC00', scenario: 'Straight' },
  { id: 'W10-1', name: 'Railroad Crossing', category: 'Warning', description: 'Warns of an upcoming railroad crossing.', expectation: 'Look, listen, and live. Be prepared to stop if a train is approaching.', shape: 'Circle', color: '#FFCC00', scenario: 'Straight' },
  { id: 'R1-6', name: 'State Law Yield To Pedestrians', category: 'Regulatory', description: 'Placed at crosswalks to remind drivers of the legal requirement to yield.', expectation: 'Stop or slow down for any pedestrians in the crosswalk.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Crosswalk' },
  { id: 'W11-1', name: 'Bicycle Crossing', category: 'Warning', description: 'Warns of a location where bicycles frequently cross or share the road.', expectation: 'Watch for cyclists. Give them at least 3 feet of space when passing.', shape: 'Diamond', color: '#FFCC00', scenario: 'Straight' },
  { id: 'W1-3', name: 'Reverse Curve', category: 'Warning', description: 'Warns of two opposite curves (S-curve) ahead.', expectation: 'Reduce speed and stay centered in your lane through both turns.', shape: 'Diamond', color: '#FFCC00', scenario: 'Curve' },
  { id: 'W2-1', name: 'Cross Road', category: 'Warning', description: 'Warns of a four-way intersection ahead.', expectation: 'Look left and right. Be prepared for cross traffic entering the road.', shape: 'Diamond', color: '#FFCC00', scenario: '4-way' },
  { id: 'R4-1', name: 'Slower Traffic Keep Right', category: 'Regulatory', description: 'Used on multi-lane highways to keep the left lane open for passing.', expectation: 'Move to the right lane if you are traveling slower than the surrounding traffic.', shape: 'Rectangle', color: '#FFFFFF', scenario: 'Straight' }
];
