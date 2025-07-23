-- Add group column to items table
alter table items add column if not exists "group" text;

-- Example data fill (update existing rows)
update items set "group" =
  case
    when item_type ilike '%sword%' or item_type ilike '%axe%' or item_type ilike '%mace%' or item_type ilike '%dagger%' or item_type ilike '%maul%' or item_type ilike '%cuirass%' or item_type ilike '%gauntlet%' or item_type ilike '%greave%' or item_type ilike '%pauldron%' or item_type ilike '%helm%' or item_type ilike '%sabat%' then 'Blacksmithing'
    when item_type ilike '%robe%' or item_type ilike '%jack%' or item_type ilike '%jerkin%' or item_type ilike '%glove%' or item_type ilike '%hat%' or item_type ilike '%belt%' or item_type ilike '%boot%' or item_type ilike '%guard%' or item_type ilike '%bracer%' or item_type ilike '%arm cop%' or item_type ilike '%helmets%' or item_type ilike '%shoulder%' then 'Clothing'
    when item_type ilike '%bow%' or item_type ilike '%staff%' or item_type ilike '%shield%' then 'Woodworking'
    when item_type ilike '%ring%' or item_type ilike '%necklace%' then 'Jewelry'
    else 'Other'
  end;
