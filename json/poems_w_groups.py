import json

# Load the poems
with open('poems.json', 'r', encoding='utf-8') as f:
    poems = json.load(f)

# Load the poem groups
with open('poem_groups.json', 'r', encoding='utf-8') as f:
    poem_groups = json.load(f)

# Initialize counters for each group and subgroup
group_counters = {}
poem_inner_nums = {}

# Function to assign poem_inner_num to each poem title
def assign_poem_inner_num(groups, group_name=None, subgroup_name=None):
    for i, (key, value) in enumerate(groups.items(), start=1):
        if isinstance(value, str):  # This is a poem title
            # Increment the counter for the current group or subgroup
            if subgroup_name is not None:
                group_counters[subgroup_name] = group_counters.get(subgroup_name, 0) + 1
                poem_inner_nums[key] = group_counters[subgroup_name]
            elif group_name is not None:
                group_counters[group_name] = group_counters.get(group_name, 0) + 1
                poem_inner_nums[key] = group_counters[group_name]
            else:
                group_counters['none'] = group_counters.get('none', 0) + 1
                poem_inner_nums[key] = group_counters['none']
        elif isinstance(value, dict):
            assign_poem_inner_num(value, key if group_name is None else group_name, key if group_name is not None else subgroup_name)

assign_poem_inner_num(poem_groups)

# Function to find the group and subgroup of a poem
def find_group_and_subgroup(title, groups, group_name=None, subgroup_name=None, group_num=1, subgroup_num=1):
    for i, (key, value) in enumerate(groups.items(), start=1):
        if key == title:
            return group_name, subgroup_name, group_num, subgroup_num if subgroup_name else None
        elif isinstance(value, dict):
            res = find_group_and_subgroup(title, value, key if group_name is None else group_name, key if group_name is not None else subgroup_name, i if group_name is None else group_num, i if group_name is not None else 1)
            if res is not None:
                return res
    return None

# Iterate over the poems and add the group and subgroup information
for i, poem in enumerate(poems, start=1):
    res = find_group_and_subgroup(poem['poem_title'], poem_groups)
    if res is not None:
        poem['poem_group'], poem['poem_subgroup'], poem['group_num'], poem['subgroup_num'] = res
    poem['poem_inner_num'] = poem_inner_nums.get(poem['poem_title'], 0)
    poem['poem_num'] = i

# Save the updated poems to a new file
with open('updated_poems.json', 'w', encoding='utf-8') as f:
    json.dump(poems, f, ensure_ascii=False, indent=4)
