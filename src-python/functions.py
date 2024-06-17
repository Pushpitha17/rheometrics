import numpy as np
from scipy.signal import savgol_filter

def smooth(x, window_size=5, order=1):
  return savgol_filter(x, window_size, order)

def find_trend_change_points(derivatives, consecutive_threshold=10):
    change_points = []
    current_sign = 0
    consecutive_count = 1
    
    for i in range(1, len(derivatives) - consecutive_threshold ):
        if(np.isnan(derivatives[i])):
            continue
        if(len(change_points) > 0 and change_points[-1] + consecutive_threshold >= i):
            continue
            
        sign = np.sign(derivatives[i])

        if sign == 0.0:
            continue
        
        if sign != current_sign:
            # Change in sign detected
            for j in range(1, consecutive_threshold):
                if np.sign(derivatives[i+j]) == sign or np.sign(derivatives[i+j]) == 0.0:
                    consecutive_count += 1
                    if consecutive_count >= consecutive_threshold:
                        change_points.append(i)
                        current_sign = sign
                        consecutive_count = 1
                else:
                    consecutive_count = 1
                    break
    return change_points

def detect_phases(time,torque, change_points):
    if(change_points[-1] != (len(time) - 1)):
        change_points.append(len(time) - 1)
    if(change_points[0] != 0):
        change_points.insert(0, 0)

    differences = []
    for i in range(1, len(change_points)):
        print(i)
        differences.append((torque[change_points[i]] - torque[change_points[i-1]]))

    max_difference_index = differences.index(max(differences))
    cure_phase_begin , cure_phase_end = change_points[max_difference_index], change_points[max_difference_index+ 1]
    
    cure_phase =  [cure_phase_begin , cure_phase_end]
    induction_phase = [0, cure_phase_begin]

    phases = {
        "induction_phase" : induction_phase,
        "cure_phase" : cure_phase,
        "after_cure_phase" : None
    }
    
    if(cure_phase_end != (len(time)-1)):
        phases["after_cure_phase"] = [cure_phase_end, len(time)]
 
    return phases

def find_inflection_point(list):
    #list = list of deravatives 
    scaled = [x * 1 for x in list]
    data = np.array(scaled)
    # plot(np.arange(len(data)), data, "Deravative", "i", "deravative")
    print(max(data), len(data), np.argmax(data))

    inflection_point = np.argmax(data)
    return inflection_point

def get_Tc_values(time, smoothed_T, Max_tr,Min_tr, cure_phases):

    # tc_values = {}
    tc_values = []

    for i in range(1, 11):
        required_tr = ((Max_tr - Min_tr) * 0.1 * i) + Min_tr
        closest_index = (smoothed_T[cure_phases[0]:cure_phases[1]] - required_tr).abs().idxmin()
        key_name = "tc_" + str(i*10)
        tc_values.append(time[closest_index])
        # tc_values[key_name] = {
        #     "time_elapsed" : df[access["t"]][closest_index],
        #     "cure_time" : df[access["t"]][closest_index] - df[access["t"]][cure_phases[0]], 
        # } 

    return tc_values

def get_ts_values(df,Min_tr, cure_phases):

    ts_values = []

    tr_req_for_ts1 = Min_tr + 1
    ts1_index =  (df['smoothed_T'][cure_phases[0]:cure_phases[1]] - tr_req_for_ts1).abs().idxmin()
    ts_values.append(df[access["t"]][ts1_index])

    tr_req_for_ts2 = Min_tr + 2
    ts1_index =  (df['smoothed_T'][cure_phases[0]:cure_phases[1]] - tr_req_for_ts2).abs().idxmin()
    ts_values.append(df[access["t"]][ts1_index])

    return ts_values

def ExtractFeatures(time , temp):

  time = np.array(time)
  torque = np.array(temp)


  smoothed_T = smooth(torque, window_size=5, order=1)
  torque_diff = np.diff(smoothed_T)

  change_points = find_trend_change_points(torque_diff, consecutive_threshold=10)
  return change_points

  