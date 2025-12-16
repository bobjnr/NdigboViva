import pandas as pd
import os

excel_file = 'NDIGBO VIVA DATABASE.xlsx'
output_csv = 'NDIGBO_VIVA_DATABASE_ALL.csv'

try:
    # Read all sheets
    xl = pd.ExcelFile(excel_file)
    sheet_names = xl.sheet_names
    print(f"Found sheets: {sheet_names}")

    all_data = []
    for sheet in sheet_names:
        print(f"Reading sheet: {sheet}")
        df = pd.read_excel(excel_file, sheet_name=sheet)
        # Add a 'Source_Sheet' column just in case, though state column should exist
        df['Source_Sheet'] = sheet
        all_data.append(df)

    # Concatenate all dataframes
    combined_df = pd.concat(all_data, ignore_index=True)

    # Save to CSV
    combined_df.to_csv(output_csv, index=False, encoding='utf-8')
    print(f"Successfully combined all sheets into {output_csv}")
    print(f"Total rows: {len(combined_df)}")

except Exception as e:
    print(f"Error: {e}")
